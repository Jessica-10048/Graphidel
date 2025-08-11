const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/order.model");
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// ---------------------------------------
// 🎯 1. Créer une session de paiement Stripe
// ---------------------------------------
router.post("/create-checkout-session", async (req, res) => {
  const { cartItems, customer } = req.body;

  console.log("📥 Données reçues dans la requête :", req.body);

  if (!cartItems || cartItems.length === 0) {
    console.error("❌ Aucun article dans le panier.");
    return res.status(400).json({ error: "Le panier est vide." });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      })),
      customer_email: customer.email,
      metadata: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phoneNumber,
        address: customer.address,
        postalCode: customer.postalCode,
        cart: JSON.stringify(
          cartItems.map((item) => ({
            _id: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          }))
        ),
      },
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("❌ Stripe session creation failed:", error);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
});

// ---------------------------------------
// 📦 2. Webhook Stripe - Enregistrement commande après paiement
// ---------------------------------------
router.post(
  "/webhook",
  express.raw({ type: "application/json" }), // ⚠️ Doit être AVANT express.json
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("⚠️ Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Paiement réussi
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const cart = JSON.parse(session.metadata.cart); // 🛒

      const newOrder = new Order({
        stripeSessionId: session.id,
        email: session.customer_email,
        totalAmount: session.amount_total / 100,
        status: "paid",
        orders: cart.map((item) => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        customer: {
          firstName: session.metadata.firstName,
          lastName: session.metadata.lastName,
          phone: session.metadata.phone,
          address: session.metadata.address,
          postalCode: session.metadata.postalCode,
        },
      });

      try {
        await newOrder.save();
        console.log("✅ Order saved:", newOrder);
      } catch (err) {
        console.error("❌ Error saving order:", err);
      }
    }

    res.json({ received: true });
  }
);

module.exports = router;
