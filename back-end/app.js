// app.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

/* ========= 1) CORS ========= */
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

/* ========= 2) Stripe webhook (RAW) ========= */
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

/* ========= 3) Parsers ========= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ========= 4) Fichiers statiques ========= */
const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), "uploads", "public");
if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });
app.use("/uploads", express.static(PUBLIC_UPLOADS_DIR));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ========= 6) Routes API ========= */
app.use("/api/user", require("./routes/user.router"));
app.use("/api/product", require("./routes/product.router"));
app.use("/api/order", require("./routes/order.router"));
app.use("/api/payment", require("./routes/payment.router"));
app.use("/api/newsletter", require("./routes/newsletter.router"));
app.use("/api/templates", require("./routes/template.router"));

/* ========= Healthcheck ========= */
app.get("/health", (_req, res) => res.json({ ok: true }));

/* ========= 7) 404 ========= */
app.use((req, res) => res.status(404).json({ message: "Route introuvable" }));

/* ========= 8) Handler d’erreurs ========= */
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({ message: err.message || "Erreur serveur" });
});

/* ========= 9) Boot ========= */
const PORT = process.env.PORT || 8000;

async function start() {
  try {
    console.log("🔌 Connexion MongoDB...");
    // N’utilise plus useNewUrlParser / useUnifiedTopology (dépréciés)
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
