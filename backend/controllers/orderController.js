import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";
  try {
    // Validate items and calculate server-side amount
    if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid items: items array is required" });
    }

    let serverAmount = 0;
    const line_items = [];

    for (const item of req.body.items) {
      // Validate item structure
      if (!item._id) {
        return res.status(400).json({ success: false, message: "Invalid item: missing _id" });
      }
      if (!item.quantity || !Number.isInteger(item.quantity) || item.quantity <= 0) {
        return res.status(400).json({ success: false, message: "Invalid item: quantity must be a positive integer" });
      }

      // Fetch food item from database
      const foodItem = await foodModel.findById(item._id);
      if (!foodItem) {
        return res.status(400).json({ success: false, message: `Food item not found: ${item._id}` });
      }

      // Calculate item subtotal using database price
      const itemSubtotal = foodItem.price * item.quantity;
      serverAmount += itemSubtotal;

      // Build Stripe line item using database values
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: foodItem.name,
          },
          unit_amount: foodItem.price * 100,
        },
        quantity: item.quantity,
      });
    }

    // Add delivery fee
    const deliveryFee = 2;
    serverAmount += deliveryFee;

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryFee * 100,
      },
      quantity: 1,
    });

    const newOrder = new orderModel({
      userId: req.user.id,
      items: req.body.items,
      amount: serverAmount,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.user.id, { cartData: {} });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    const order = await orderModel.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    
    if (order.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    if (success == "true") {
      if (order.payment === true) {
        return res.json({ success: true, message: "Already paid" });
      }
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user.id });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin pannel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// api for updating status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
