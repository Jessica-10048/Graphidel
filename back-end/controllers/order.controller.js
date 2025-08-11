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

// PUT /update/:id - VERSION AMÉLIORÉE
const updateOrder = async (req, res) => {
  try {
    const { status, trackingNumber, ...rest } = req.body;

    // Récupérer l'ancienne commande pour comparer l'ancien statut
    const current = await Order.findById(req.params.id);
    if (!current) return res.status(404).json({ message: 'Order not found.' });

    const oldStatus = (current.status || '').toLowerCase();
    const newStatus = (status || oldStatus).toLowerCase();

    console.log(`🔄 Order ${req.params.id}: ${oldStatus} → ${newStatus}`);

    // Validation des transitions autorisées
    const validTransitions = {
      'pending': ['processed', 'cancelled'],
      'processed': ['shipped', 'cancelled'],
      'shipped': ['delivered'],
      'delivered': [],
      'cancelled': []
    };

    if (status && !validTransitions[oldStatus]?.includes(newStatus)) {
      return res.status(400).json({ 
        message: `Transition invalide: ${oldStatus} → ${newStatus}`,
        allowedTransitions: validTransitions[oldStatus] || []
      });
    }

    // Mise à jour des champs + timestamps selon la transition
    if (newStatus === 'processed' && oldStatus !== 'processed') {
      current.status = 'Processed';
      current.processedAt = new Date();
      console.log(`✅ Commande ${req.params.id} confirmée`);
      
    } else if (newStatus === 'shipped' && oldStatus !== 'shipped') {
      current.status = 'Shipped';
      current.shippedAt = new Date();
      
      // Ajouter le numéro de suivi si fourni
      if (trackingNumber) {
        current.trackingNumber = trackingNumber;
      }
      console.log(`🚚 Commande ${req.params.id} expédiée${trackingNumber ? ` (suivi: ${trackingNumber})` : ''}`);
      
    } else if (newStatus === 'delivered' && oldStatus !== 'delivered') {
      current.status = 'Delivered';
      current.deliveredAt = new Date();
      console.log(`📦 Commande ${req.params.id} livrée`);
      
    } else if (newStatus === 'cancelled') {
      current.status = 'Cancelled';
      console.log(`❌ Commande ${req.params.id} annulée`);
      
    } else if (status) {
      // Autre changement de statut
      current.status = status;
    }

    // Appliquer les autres champs éventuels
    Object.assign(current, rest);

    const updated = await current.save();

    // Envoi d'emails conditionnels UNIQUEMENT si transition détectée
    let emailSent = false;
    try {
      if (newStatus === 'processed' && oldStatus !== 'processed' && updated.email) {
        await sendOrderConfirmation(updated.email, updated.toObject());
        emailSent = true;
        console.log(`📧 Email de confirmation envoyé à ${updated.email}`);
      }
      
      if (newStatus === 'shipped' && oldStatus !== 'shipped' && updated.email) {
        await sendOrderShipped(updated.email, updated.toObject());
        emailSent = true;
        console.log(`📧 Email d'expédition envoyé à ${updated.email}`);
      }
      
    } catch (emailError) {
      console.error('📧 Email error:', emailError.message);
      // On ne bloque pas la réponse API si l'email échoue
    }

    // Réponse avec info sur l'email et la transition
    res.json({
      ...updated.toObject(),
      emailSent,
      transition: oldStatus !== newStatus ? `${oldStatus} → ${newStatus}` : null
    });
    
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