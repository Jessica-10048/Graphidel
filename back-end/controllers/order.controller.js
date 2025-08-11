const Order = require('../models/order.model');
const sendOrderConfirmation = require('../utils/sendEmail');           // email "confirmé / facture"
const sendOrderShipped = require('../utils/sendOrderShipped');         // email "expédié"

// (Optionnel) POST /add si tu veux créer manuellement (sinon, laisse au webhook)
const postOrder = async (req, res) => {
  try {
    const { products, email, customer } = req.body;
    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'Empty cart.' });
    }

    const cleaned = products.map(p => ({
      _id: p._id,
      name: p.name,
      price: Number(p.price),
      quantity: Number(p.quantity),
    }));

    const total = cleaned.reduce((acc, p) => acc + p.price * p.quantity, 0);

    const order = await Order.create({
      products: cleaned,
      email,
      status: 'Pending',              // 👈 par défaut en attente
      total,
      customer: {
        firstName: customer?.firstName,
        lastName: customer?.lastName,
        phone: customer?.phone,
        address: customer?.address,
        postalCode: customer?.postalCode,
      }
    });

    res.status(201).json({ message: 'Order saved.', order });
  } catch (err) {
    console.error('❌ Error in postOrder:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /all
const getAllOrders = async (_req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('❌ Error in getAllOrders:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// GET /get/:id
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json(order);
  } catch (err) {
    console.error('❌ Error in getOrder:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// PUT /update/:id
const updateOrder = async (req, res) => {
  try {
    const { status, ...rest } = req.body;

    // On récupère l'ancienne commande pour comparer l'ancien statut
    const current = await Order.findById(req.params.id);
    if (!current) return res.status(404).json({ message: 'Order not found.' });

    const oldStatus = (current.status || '').toLowerCase();
    const newStatus = (status || oldStatus).toLowerCase();

    // MàJ des champs + timestamps sur transition
    if (newStatus === 'processed' && oldStatus !== 'processed') {
      current.status = 'Processed';
      current.processedAt = new Date();        // optionnel
    } else if (newStatus === 'shipped' && oldStatus !== 'shipped') {
      current.status = 'Shipped';
      current.shippedAt = new Date();          // optionnel
    } else if (status) {
      // autre changement de statut (ex: repasser en Pending)
      current.status = req.body.status;
    }

    // appliquer les autres champs éventuels envoyés
    Object.assign(current, rest);

    const updated = await current.save();

    // Emails conditionnels UNIQUEMENT si transition détectée
    try {
      if (newStatus === 'processed' && oldStatus !== 'processed' && updated.email) {
        await sendOrderConfirmation(updated.email, updated.toObject());
      }
      if (newStatus === 'shipped' && oldStatus !== 'shipped' && updated.email) {
        await sendOrderShipped(updated.email, updated.toObject());
      }
    } catch (e) {
      console.error('📧 Email error:', e.message);
      // on ne bloque pas la réponse API si l'email échoue
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Error in updateOrder:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// DELETE /delete/:id
const deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Order not found.' });
    res.json({ message: 'Order deleted.' });
  } catch (err) {
    console.error('❌ Error in deleteOrder:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  postOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
