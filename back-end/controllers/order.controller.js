const Order = require('../models/order.model');

// POST /add
const postOrder = async (req, res) => {
  try {
    const { products, email } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'Panier vide.' });
    }

    const cleanedProducts = products.map(product => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: product.quantity
    }));

    const total = cleanedProducts.reduce((acc, p) => acc + p.price * p.quantity, 0);

    const order = await Order.create({
      products: cleanedProducts,
      email,
      status: 'En attente',
      total,
    });

    res.status(201).json({ message: 'Commande enregistrée.', order });
  } catch (err) {
    console.error('❌ Erreur dans postOrder :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// GET /all
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('❌ Erreur dans getOrders :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// GET /get/:id
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Commande non trouvée.' });
    res.json(order);
  } catch (err) {
    console.error('❌ Erreur dans getOrder :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// PUT /update/:id
const sendOrderConfirmation = require('../utils/sendEmail');

const updateOrder = async (req, res) => {
  try {
    console.log("🛠 Requête de mise à jour :", req.body);

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      console.log("❌ Commande non trouvée.");
      return res.status(404).json({ message: 'Commande non trouvée.' });
    }

    console.log("✅ Commande mise à jour :", updated);

    if (req.body.status === 'Processed' && updated.email) {
      console.log("📬 Statut est 'Traité'. Tentative d'envoi d'email à :", updated.email);
      if (updated.email) {
        await sendOrderConfirmation(updated.email, updated);
      } else {
        console.log("⚠️ Aucune adresse email trouvée pour cette commande.");
      }
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Erreur dans updateOrder :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};



// DELETE /delete/:id
const deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Commande non trouvée.' });
    res.json({ message: 'Commande supprimée.' });
  } catch (err) {
    console.error('❌ Erreur dans deleteOrder :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  postOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
