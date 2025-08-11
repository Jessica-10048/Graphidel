const express = require('express');
const router = express.Router();
const orderController= require('../controllers/order.controller');

router.post('/add', orderController.postOrder);      // optionnel si tu gardes la création manuelle
router.get('/all', orderController.getAllOrders);
router.get('/get/:id', orderController.getOrder);
router.put('/update/:id', orderController.updateOrder);
router.delete('/delete/:id', orderController.deleteOrder);

module.exports = router;
