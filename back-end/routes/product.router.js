// routes/product.router.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const upload = require("../middleware/upload");

// 📄 Liste
router.get("/all", productController.getAllProduct);

// 🔍 Détail
router.get("/get/:id", productController.getProduct);

// ➕ Création (supporte 'images' et 'image')
router.post(
  "/add",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "image",  maxCount: 1 },
  ]),
  productController.postProduct
);

// 🛠️ Mise à jour (supporte 'images' et 'image')
router.put(
  "/update/:id",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "image",  maxCount: 1 },
  ]),
  productController.updateProduct
);

// 🔴 Suppression
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;
