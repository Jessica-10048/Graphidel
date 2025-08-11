const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const COOKIE_NAME = "token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // mets true en prod HTTPS
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const signAndSend = (res, user, message = "OK") => {
  const payload = { _id: user._id, email: user.email, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

  // Option cookie httpOnly (en plus du JSON)
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

  return res.status(200).json({
    message,
    token, // utile si tu préfères localStorage côté front
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
};

// Enregistrement
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists." });

    // ⚠️ suppose que le modèle hash le password en pre('save').
    // Sinon, décommente :
    // const hashed = await bcrypt.hash(password, 10);
    // const newUser = await User.create({ firstName, lastName, email, password: hashed });

    const newUser = await User.create({ firstName, lastName, email, password });

    return signAndSend(res.status(201), newUser, "User registered successfully");
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Connexion
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    // comparePassword() si défini dans le modèle, sinon fallback bcrypt
    const isMatch = typeof user.comparePassword === "function"
      ? await user.comparePassword(password)
      : await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    // Retire le password de l'objet pour la suite
    user.password = undefined;

    return signAndSend(res, user, "Login successful");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Déconnexion
const logout = async (_req, res) => {
  try {
    res.clearCookie(COOKIE_NAME, { ...COOKIE_OPTIONS, maxAge: 0 });
    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ message: "Error during logout" });
  }
};

// Profil courant
const me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving profile" });
  }
};

// Récupérer tous les utilisateurs (→ protégé par authAdmin dans le router)
const getAllUser = async (_req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ message: "Error retrieving users" });
  }
};

// Récupérer un utilisateur par ID (self OU admin)
const getUserByIdSecure = async (req, res) => {
  try {
    const { id } = req.params;
    if (String(req.user._id) !== String(id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Error retrieving user" });
  }
};

// (ancienne) publique: garde-la si tu veux, mais privilégie la secure
const getUser = getUserByIdSecure;

// Mettre à jour un utilisateur (self OU admin)
const updateUserSecure = async (req, res) => {
  try {
    const { id } = req.params;

    if (String(req.user._id) !== String(id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const updates = { ...req.body };

    // Un non-admin ne peut pas s'auto-promouvoir
    if (updates.role && req.user.role !== "admin") {
      delete updates.role;
    }

    if (updates.password) {
      // Si ton modèle hash en pre('save'), tu peux au choix :
      // - soit hasher ici
      // - soit charger le doc, set(), save()
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated", user });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Error updating user" });
  }
};

// (ancienne) publique: garde-la si tu veux, mais privilégie la secure
const updateUser = updateUserSecure;

// Supprimer un utilisateur (→ protégé par authAdmin dans le router)
const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Error deleting user" });
  }
};

module.exports = {
  register,
  login,
  logout,
  me,
  getAllUser,
  getUser,              // alias vers secure
  getUserByIdSecure,
  updateUser,           // alias vers secure
  updateUserSecure,
  deleteUser,
};
