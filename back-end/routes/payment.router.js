// routes/payment.router.js
const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("⚠️ STRIPE_SECRET_KEY is not set. Checkout will fail.");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Valide/normalise l’URL client (doit inclure http(s)://)
function getClientUrl() {
  const url = process.env.CLIENT_URL || "http://localhost:5173";
  if (!/^https?:\/\//i.test(url)) {
    throw new Error(
      `CLIENT_URL must include http(s):// — got "${process.env.CLIENT_URL}". Example: http://localhost:5173`
    );
  }
  return url.replace(/\/+$/, ""); // retire le trailing slash
}

// Helper: force string pour metadata Stripe
const s = (v) => (v == null ? "" : String(v));

// POST /api/payment/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { cartItems, customer = {} } = req.body;

    // 1) Garde-fous de base
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "EMPTY_CART" });
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "MISSING_STRIPE_SECRET_KEY" });
    }

    // 2) Build line_items (GBP car tu affiches des £ côté UI)
    const line_items = cartItems.map((item) => {
      const name = s(item.name) || "Item";
      const price = Number(item.price);
      const quantity = Number(item.quantity || 1);

      if (!Number.isFinite(price) || price <= 0) {
        throw new Error(`INVALID_PRICE for "${name}"`);
      }
      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error(`INVALID_QUANTITY for "${name}"`);
      }

      return {
        price_data: {
          currency: "gbp",
          product_data: { name },
          unit_amount: Math.round(price * 100), // en pence
        },
        quantity,
      };
    });

    // 3) Metadata : uniquement des strings
    const metadata = {
      firstName: s(customer.firstName),
      lastName: s(customer.lastName),
      phone: s(customer.phoneNumber),
      address: s(customer.address),
      postalCode: s(customer.postalCode),
      cart: JSON.stringify(
        cartItems.map((i) => ({
          _id: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        }))
      ),
    };

    const CLIENT_URL = getClientUrl();

    // 4) Crée la Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      customer_email: s(customer.email) || undefined, // ok si vide
      metadata,
      success_url: `${CLIENT_URL}/success`,
      cancel_url: `${CLIENT_URL}/cancel`,
    });

    // 5) Retourne à la fois url et id (le front peut utiliser l’un ou l’autre)
    return res.json({ url: session.url, id: session.id });
  } catch (error) {
    console.error("❌ create-checkout-session:", {
      message: error?.message,
      type: error?.type,
      code: error?.code,
    });
    return res
      .status(500)
      .json({ error: error?.message || "Stripe session creation failed" });
  }
});

module.exports = router;
