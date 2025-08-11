// routes/payment.webhook.js
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/order.model");
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

module.exports = async (req, res) => {
  console.log("🎯 Webhook hit:", req.originalUrl);

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("⚠️ Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("💳 checkout.session.completed:", session.id);

      // 1) Tente metadata.cart (ton flux réel)
      let products = [];
      if (session.metadata?.cart) {
        try {
          const cart = JSON.parse(session.metadata.cart);
          products = cart.map(i => ({
            _id: i._id,
            name: i.name,
            price: Number(i.price),
            quantity: Number(i.quantity),
          }));
        } catch {
          console.warn("⚠️ metadata.cart non parsable");
        }
      }

      // 2) Fallback pour les events 'trigger' (pas de metadata)
      if (products.length === 0) {
        try {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
          products = (lineItems.data || []).map(li => ({
            _id: undefined,
            name: li.description,
            price: Number(li.amount_total / 100) / Number(li.quantity || 1),
            quantity: Number(li.quantity || 1),
          }));
        } catch (e) {
          console.warn("⚠️ Impossible de lire line_items:", e.message);
        }
      }

      // 3) Idempotence : ne recrée pas 2 fois
      const exists = await Order.findOne({ "meta.stripeSessionId": session.id });
      if (exists) {
        console.log("ℹ️ Order already exists for session:", session.id);
        return res.json({ received: true });
      }

      const total =
        (session.amount_total != null ? session.amount_total / 100
                                      : products.reduce((a,p)=>a + p.price*p.quantity, 0));

      const order = await Order.create({
        email: session.customer_details?.email || session.customer_email,
        status: "Pending",
        products,
        total,
        customer: {
          firstName: session.metadata?.firstName || "",
          lastName: session.metadata?.lastName || "",
          phone: session.metadata?.phone || "",
          address: session.metadata?.address || "",
          postalCode: session.metadata?.postalCode || "",
        },
        meta: {
          stripeEventId: event.id,
          stripeSessionId: session.id,
          stripePaymentStatus: session.payment_status, // 'paid'
        }
      });

      console.log("✅ Order saved:", order._id);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("❌ Error in webhook handler:", err);
    res.status(200).json({ handled: false, error: err.message });
  }
};
