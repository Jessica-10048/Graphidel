// middlewares/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Auth simple
const auth = async (req, res, next) => {
  try {
    let token = null;
    const h = req.headers.authorization || "";
    if (h.toLowerCase().startsWith("bearer ")) token = h.split(" ")[1];
    // si tu veux aussi le cookie:
    // if (!token && req.cookies?.token) token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Token manquant" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id email role firstName lastName");
    if (!user) return res.status(401).json({ message: "Utilisateur introuvable" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Erreur auth middleware:", err);
    return res.status(401).json({ message: "Authentification invalide" });
  }
};

// Auth + Admin
const authAdmin = (req, res, next) => {
  auth(req, res, () => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Accès réservé aux administrateurs" });
    }
    next();
  });
};

module.exports = { auth, authAdmin };
