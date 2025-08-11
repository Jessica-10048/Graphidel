const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Processed", "Shipped", "Delivered", "Cancelled"],
    default: "Pending" 
  },
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
  
  // Timestamps spécifiques pour chaque étape
  processedAt: { type: Date },    // Quand admin confirme
  shippedAt: { type: Date },      // Quand expédié
  deliveredAt: { type: Date },    // Quand livré (optionnel)
  
  // Suivi
  trackingNumber: { type: String },
  
  meta: {
    stripeSessionId: String,
    stripePaymentStatus: String,
    stripeEventId: String,
  },
}, { timestamps: true }); // createdAt et updatedAt automatiques

module.exports = mongoose.model("Order", orderSchema);