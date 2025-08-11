const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  status: { type: String, default: "Pending" }, 
  products: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  total: Number,
  customer: {
    firstName: String,
    lastName: String,
    phone: String,
    address: String,
    postalCode: String,
  },
  meta: {
    stripeSessionId: String,
    stripePaymentStatus: String,
    stripeEventId: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
