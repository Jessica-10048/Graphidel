const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const upload = require("../middleware/upload");

// 📄 Récupérer tous les produits
router.get("/all", productController.getAllProduct);

// 🔍 Récupérer un produit par son ID
router.get("/get/:id", productController.getProduct);

// ➕ Créer un nouveau produit avec plusieurs images
router.post("/add", upload.array("images", 5), productController.postProduct);

// 🛠️ Mettre à jour un produit (ajout d’images en plus)
router.put("/update/:id", upload.array("images", 5), productController.updateProduct);

// 🔴 Supprimer un produit
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;
