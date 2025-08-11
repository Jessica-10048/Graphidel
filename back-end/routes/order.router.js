const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

// POST /api/orders/add - Créer une commande manuellement (optionnel)
router.post('/add', orderController.postOrder);

// GET /api/orders/all - Récupérer toutes les commandes (admin)
router.get('/all', orderController.getAllOrders);

// GET /api/orders/get/:id - Récupérer une commande spécifique
router.get('/get/:id', orderController.getOrder);

// PUT /api/orders/update/:id - Mettre à jour le statut d'une commande
router.put('/update/:id', orderController.updateOrder);

// DELETE /api/orders/delete/:id - Supprimer une commande
router.delete('/delete/:id', orderController.deleteOrder);

module.exports = router;