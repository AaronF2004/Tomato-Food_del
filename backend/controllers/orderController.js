import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

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
      address: req.body.address
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
      // Redirect on success to verification page
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      // Redirect directly back to /order delivery form if cancelled or back is pressed
      cancel_url: `${frontend_url}/order?cancelled=true&orderId=${newOrder._id}`
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Place Order Error:", error);
    res.json({ success: false, message: "Error placing order" });
  }
};

// Verifying Order Payment
export const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      const order = await orderModel.findById(orderId);
      if (order) {
        await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
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

// User Orders for Frontend
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("User Orders Error:", error);
    res.json({ success: false, message: "Error fetching user orders" });
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

    // Instantly update status to Cancelled
    await orderModel.findByIdAndUpdate(orderId, { status: "Cancelled" });
    return res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    return res.json({ success: false, message: "Error cancelling order" });
  }
};

// Listing Orders for Admin Panel
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("List Orders Error:", error);
    res.json({ success: false, message: "Error fetching all orders" });
  }
};

// Update order status (Admin)
export const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.json({ success: false, message: "Error updating status" });
  }
};