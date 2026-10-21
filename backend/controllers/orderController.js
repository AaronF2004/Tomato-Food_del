import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import {
  sendOrderConfirmationEmail,
  sendOrderCancellationEmail
} from "../utils/emailService.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing User Order from Frontend
export const placeOrder = async (req, res) => {
  try {
    const frontend_url =
      req.body.frontend_url ||
      req.headers.origin ||
      process.env.FRONTEND_URL ||
      "https://tomato-food-frontend.vercel.app";

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: false
    });
    await newOrder.save();

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100 * 80)
      },
      quantity: item.quantity
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: Math.round(2 * 100 * 80)
      },
      quantity: 1
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/order?cancelled=true&orderId=${newOrder._id}`
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Place Order Error:", error);
    res.json({ success: false, message: "Error placing order" });
  }
};

// Verifying Order Payment (Triggered after Stripe PG finishes)
export const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      const order = await orderModel.findById(orderId);

      if (order) {
        await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

        // Retrieve user email to send receipt slip
        const user = await userModel.findById(order.userId);
        const recipientEmail = user?.email || order.address?.email;

        if (recipientEmail) {
          sendOrderConfirmationEmail(recipientEmail, order);
        }
      }

      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.error("Verify Order Error:", error);
    res.json({ success: false, message: "Error verifying order" });
  }
};

// Instant Order Cancellation (User/Direct)
export const cancelOrder = async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    await orderModel.findByIdAndUpdate(orderId, { status: "Cancelled" });

    // Retrieve user email to send cancellation slip
    const user = await userModel.findById(order.userId);
    const recipientEmail = user?.email || order.address?.email;

    if (recipientEmail) {
      sendOrderCancellationEmail(recipientEmail, order);
    }

    return res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    return res.json({ success: false, message: "Error cancelling order" });
  }
};

// User Orders for Frontend
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({
      userId: req.body.userId,
      payment: true
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("User Orders Error:", error);
    res.json({ success: false, message: "Error fetching user orders" });
  }
};

// Listing Orders for Admin Panel
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ payment: true });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("List Orders Error:", error);
    res.json({ success: false, message: "Error fetching all orders" });
  }
};

// Update order status (Admin)
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });

    // If an admin manually marks an order as Cancelled, send the slip as well
    if (status === "Cancelled") {
      const order = await orderModel.findById(orderId);
      if (order) {
        const user = await userModel.findById(order.userId);
        const recipientEmail = user?.email || order.address?.email;
        if (recipientEmail) {
          sendOrderCancellationEmail(recipientEmail, order);
        }
      }
    }

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.json({ success: false, message: "Error updating status" });
  }
};