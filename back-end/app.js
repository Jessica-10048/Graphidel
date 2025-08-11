const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

/* ========= 1) CORS ========= */
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

/* ========= 2) Webhook Stripe AVANT tout parser ========= */
const paymentWebhookHandler = require("./routes/payment.webhook");
app.post("/api/payment/webhook",
  express.raw({ type: "application/json" }),
  paymentWebhookHandler
);

// ensuite seulement :
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



/* ========= 4) Fichiers statiques ========= */
const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), "uploads", "public");
if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });
app.use("/uploads", express.static(PUBLIC_UPLOADS_DIR));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ========= 5) Routes API ========= */
app.use("/api/user", require("./routes/user.router"));      // si présents chez toi
app.use("/api/product", require("./routes/product.router")); // idem
app.use("/api/order", require("./routes/order.router"));
app.use("/api/payment", require("./routes/payment.router"));
app.use("/api/newsletter", require("./routes/newsletter.router")); // si présent
app.use("/api/templates", require("./routes/template.router"));     // si présent

/* ========= Healthcheck ========= */
app.get("/health", (_req, res) => res.json({ ok: true }));

/* ========= 404 ========= */
app.use((req, res) => res.status(404).json({ message: "Route introuvable" }));

/* ========= Handler d’erreurs ========= */
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({ message: err.message || "Erreur serveur" });
});

/* ========= Boot ========= */
const PORT = process.env.PORT || 8000;

async function start() {
  try {
    console.log("🔌 Connexion MongoDB...");
    await mongoose.connect(`${process.env.MONGO_URI_LOCAL}/${process.env.DB_NAME}`);
    console.log("✅ MongoDB connecté !");
    app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
  } catch (err) {
    console.error("❌ Erreur MongoDB :", err);
    process.exit(1);
  }
}

start();

module.exports = app;
