// app.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

/* ========= 1) CORS ========= */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* ========= 2) Webhook Stripe (RAW body obligatoire) ========= */
const paymentWebhook = require("./routes/payment.webhook");
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  paymentWebhook
);

/* ========= 3) Parsers globaux ========= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ========= 4) Fichiers statiques - CONFIGURATION SIMPLIFIÉE ========= */

// Créer les dossiers s'ils n'existent pas
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const PUBLIC_DIR = path.join(process.cwd(), "public");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configuration des routes statiques - ORDRE IMPORTANT !
// Servir uploads/ directement depuis /uploads
app.use("/uploads", express.static(UPLOADS_DIR));

// Servir public/ depuis la racine
app.use(express.static(PUBLIC_DIR));

// Route de test pour diagnostiquer les images
app.get("/api/test-image/:filename", (req, res) => {
  const filename = req.params.filename;
  
  // Chemins possibles selon votre structure
  const possiblePaths = [
    path.join(UPLOADS_DIR, "public", filename),          // uploads/public/filename
    path.join(UPLOADS_DIR, "public", "products", filename), // uploads/public/products/filename
    path.join(UPLOADS_DIR, filename),                    // uploads/filename
    path.join(PUBLIC_DIR, "products", filename),        // public/products/filename
    path.join(PUBLIC_DIR, filename),                     // public/filename
  ];
  
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      // Construire l'URL publique correcte
      let publicUrl;
      if (filePath.includes(path.join(UPLOADS_DIR))) {
        const relativePath = path.relative(UPLOADS_DIR, filePath).replace(/\\/g, "/");
        publicUrl = `http://localhost:8000/uploads/${relativePath}`;
      } else {
        const relativePath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, "/");
        publicUrl = `http://localhost:8000/${relativePath}`;
      }
      
      return res.json({ 
        exists: true, 
        path: filePath,
        url: publicUrl,
        size: fs.statSync(filePath).size
      });
    }
  }
  
  res.status(404).json({ 
    exists: false, 
    searchedPaths: possiblePaths 
  });
});

/* ========= 5) Routes API ========= */
const paymentRouter = require("./routes/payment.router");
app.use("/api/payment", paymentRouter);

app.use("/api/user", require("./routes/user.router"));
app.use("/api/product", require("./routes/product.router"));
app.use("/api/order", require("./routes/order.router"));
app.use("/api/newsletter", require("./routes/newsletter.router"));
app.use("/api/templates", require("./routes/template.router"));

/* ========= 6) Healthcheck ========= */
app.get("/health", (_req, res) => res.json({ ok: true }));

/* ========= 7) 404 ========= */
app.use((req, res) => res.status(404).json({ message: "Route introuvable" }));

/* ========= 8) Handler d'erreurs ========= */
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({ message: err.message || "Erreur serveur" });
});

/* ========= 9) Boot ========= */
const PORT = process.env.PORT || 8000;

async function start() {
  try {
    if (!process.env.MONGO_URI_LOCAL || !process.env.DB_NAME) {
      console.warn("⚠️ MONGO_URI_LOCAL ou DB_NAME manquant dans .env");
    }

    console.log("🔌 Connexion MongoDB...");
    await mongoose.connect(`${process.env.MONGO_URI_LOCAL}/${process.env.DB_NAME}`);
    console.log("✅ MongoDB connecté !");

    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur le port ${PORT}`);
      console.log("📁 Static files:");
      console.log("  /uploads -> ", UPLOADS_DIR);
      console.log("  / -> ", PUBLIC_DIR);
    });
  } catch (err) {
    console.error("❌ Erreur MongoDB :", err);
    process.exit(1);
  }
}

start();

module.exports = app;