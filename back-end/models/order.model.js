const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  stripeSessionId: String,
  totalAmount: Number,
  status: { type: String, default: "Pending" },
  orders: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  customer: {
    firstName: String,
    lastName: String,
    phone: String,
    address: String,
    postalCode: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
