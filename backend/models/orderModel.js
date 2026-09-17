import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: {
    type: String,
    enum: [
      "Placed",
      "Preparing",
      "Ready for Pickup",
      "Out for Delivery",
      "Delivered",
      "Cancelled"
    ],
    default: "Placed"
  },
  date: { type: Date, default: Date.now() },
  payment: { type: Boolean, default: false },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
