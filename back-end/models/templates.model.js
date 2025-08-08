// models/templates.model.js
const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  filename: { type: String, required: true },   // Nom du fichier
  path: { type: String, required: true },       // Chemin absolu ou relatif
  mimetype: { type: String },                   // Type MIME
  size: { type: Number },                       // Taille en octets
  version: { type: String, default: "1.0.0" },  // Version de l’asset
}, { _id: false });

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  currency: { type: String, default: "GBP" },

  // Images publiques visibles dans la boutique
  images: [{ type: String }],

  // Fichiers privés téléchargeables après achat
  assets: [assetSchema],

  tags: [{ type: String, trim: true }],
  categories: [{ type: String, trim: true }],

  isActive: { type: Boolean, default: true },
  isDigital: { type: Boolean, default: true },

  // Optionnel : propriétaire ou créateur
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

}, { timestamps: true });

// Auto-génération du slug si vide
templateSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

module.exports = mongoose.model("Template", templateSchema);
