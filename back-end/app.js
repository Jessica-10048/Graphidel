// app.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// 🧠 1. CORS en premier
app.use(cors({
  origin: "http://localhost:5173",
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ⚠️ 2. Route Stripe Webhook en brut (avant json)
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// ✅ 3. Parser JSON après le webhook Stripe
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 4. Fichiers statiques
app.use("/uploads", express.static("uploads"));

// 🗄️ 5. Connexion MongoDB
mongoose.connect(`${process.env.MONGO_URI_LOCAL}/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connecté !"))
.catch((err) => console.error("❌ Erreur MongoDB :", err));

// 🚀 6. Routes API (y compris Stripe)
app.use("/api/user", require("./routes/user.router"));
app.use("/api/product", require("./routes/product.router"));
app.use("/api/order", require("./routes/order.router"));
app.use("/api/payment", require("./routes/payment.router")); // contient create-checkout-session ET webhook
app.use("/api/newsletter", require("./routes/newsletter.router"));
// 🌍 7. Lancer le serveur
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});

module.exports = app;
