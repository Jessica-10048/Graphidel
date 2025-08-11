const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price:       { type: Number, required: true, min: 0 },
    promo:       { type: Number, default: null, min: 0 }, // prix promo (optionnel)
    discount:    { type: Number, default: 0, min: 0, max: 100 }, // pourcentage éventuel
    image:       { type: String, default: null }, // legacy (compat)
    images:      { type: [String], default: [] }, // ✅ nouveau
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
