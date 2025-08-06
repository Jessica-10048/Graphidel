const express = require('express');
const router = express.Router();
const orderController= require('../controllers/order.controller');

router.post('/add', orderController.postOrder);

router.get('/all',orderController.getAllOrders);

// 🛠️ Mettre à jour une comande 
router.put('/update/:id',  orderController.updateOrder);

// 🔴 Supprimer une comande
router.delete('/delete/:id', orderController.deleteOrder);

// 🔍 Récupérer une comande par son ID
router.get('/get/:id', orderController.getOrder);

module.exports = router;
