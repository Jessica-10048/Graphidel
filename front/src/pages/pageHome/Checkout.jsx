import React, { useState } from "react";
import { useCart } from "../../utils/context/CartContext";
import { loadStripe } from "@stripe/stripe-js";

// Initialise Stripe avec ta clé publique (⚠️ à remplacer)
const stripePromise = loadStripe("pk_test_51RskKyFdUAACxkZQQqRknJUYMhRMhZOhj9DxPHwUvxtQn2PCY29A1039WPwqqVDzCR4AdF370N5o7Qzo4mffauET00dlUoOg5k");

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [email, setEmail] = useState("");

  const deliveryFee = 5.0;
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subtotal + deliveryFee;

  const handlePayment = async () => {
    const stripe = await stripePromise;

    const response = await fetch("http://localhost:8000/api/payment/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItems,
        customer: {
          firstName,
          lastName,
          phoneNumber,
          address,
          postalCode,
          email
        },
      }),
    });

    const data = await response.json();

   if (data.id) {
  await stripe.redirectToCheckout({ sessionId: data.id });
} else {
  console.error("❌ Stripe error:", data.error || data);
  alert("An error occurred during checkout: " + (data.error?.message || "Unknown error"));
}

  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">🧾 Checkout</h2>
      <div className="row">
        {/* Address Form */}
        <div className="col-md-6">
          <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="(555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="123 Main Street"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Postal Code</label>
              <input
                type="text"
                className="form-control"
                placeholder="10001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              💳 Pay with Stripe
            </button>
          </form>
        </div>

        {/* Cart Summary */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h4>🛍️ Order Summary</h4>
            </div>
            <ul className="list-group list-group-flush">
              {cartItems.map((item) => (
                <li
                  key={item._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{item.name}</strong><br />
                    <small>{item.quantity} × ${item.price.toFixed(2)}</small>
                  </div>
                  <span>${(item.quantity * item.price).toFixed(2)}</span>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <strong>Subtotal</strong>
                <span>${subtotal.toFixed(2)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <strong>Delivery Fee</strong>
                <span>${deliveryFee.toFixed(2)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <strong>Total</strong>
                <span>${total.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 