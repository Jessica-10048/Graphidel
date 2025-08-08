const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { auth, authAdmin } = require("../middleware/auth"); // <- regroupe auth + admin

// --- Auth publiques ---
router.post("/register", userController.register);
router.post("/sign", userController.login);

// (optionnel) session
router.post("/logout", auth, userController.logout); // si tu l’implémentes
router.get("/me", auth, userController.me);         // renvoie l'utilisateur courant

// --- Admin uniquement ---
router.get("/all", authAdmin, userController.getAllUser);
router.delete("/delete/:id", authAdmin, userController.deleteUser);

// --- Accès utilisateur ou admin ---
// get/update un user : autoriser si c'est SOI-MÊME ou ADMIN
router.get("/get/:id", auth, userController.getUserByIdSecure);
router.put("/update/:id", auth, userController.updateUserSecure);

module.exports = router;
