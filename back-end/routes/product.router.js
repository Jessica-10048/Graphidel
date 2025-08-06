const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const upload = require('../middleware/upload'); // Middleware pour l'upload d'image

// 📄 Récupérer tous les produits
router.get('/all', productController.getAllProduct);

// ➕ Créer un nouveau produit (avec image)
router.post('/add', upload.single('image'), productController.postProduct);


// 🛠️ Mettre à jour un produit (avec image si nouvelle image uploadée)
router.put('/update/:id', upload.single('image'), productController.updateProduct);

// 🔴 Supprimer un produit
router.delete('/delete/:id', productController.deleteProduct);

// 🔍 Récupérer un produit par son ID
router.get('/get/:id', productController.getProduct);

module.exports = router;
