import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order from frontend
export const placeOrder = async (req, res) => {
  // Determine frontend URL: fallback to your live Vercel domain if on mobile/production
  const clientOrigin =
    req.headers.origin ||
    process.env.FRONTEND_URL ||
    "https://tomato-food-frontend.vercel.app";

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges"
        },
        unit_amount: 2 * 100
      },
      quantity: 1
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${clientOrigin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${clientOrigin}/verify?success=false&orderId=${newOrder._id}`
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.json({ success: false, message: "Error initiating checkout session" });
  }
};

// Verifying order payment
export const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true" || success === true) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.json({ success: false, message: "Verification error" });
  }
};

// User orders for frontend
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Fetch user orders failed:", error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin panel
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("List orders failed:", error);
    res.json({ success: false, message: "Error" });
  }
};

// Updating order status for admin
export const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error("Update status failed:", error);
    res.json({ success: false, message: "Error" });
  }
};