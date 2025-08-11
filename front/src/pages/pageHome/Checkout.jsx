import React, { useState } from "react";
import { useCart } from "../../utils/context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import URL from "../../utils/constants/url"; // Utilise tes constantes

// Initialise Stripe avec ta clé publique
const stripePromise = loadStripe("pk_test_51RskKyFdUAACxkZQQqRknJUYMhRMhZOhj9DxPHwUvxtQn2PCY29A1039WPwqqVDzCR4AdF370N5o7Qzo4mffauET00dlUoOg5k");

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const deliveryFee = 5.0;
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subtotal + deliveryFee;

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert("Votre panier est vide !");
      return;
    }

    setLoading(true);
    
    try {
      const stripe = await stripePromise;

      // Utilise ton URL de base + endpoint payment
      console.log("🔗 Calling:", `${URL.BASE_URL}/api/payment/create-checkout-session`);
      
      const response = await fetch(`${URL.BASE_URL}/api/payment/create-checkout-session`, {
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

      console.log("📡 Response status:", response.status);
      console.log("📡 Response headers:", response.headers.get('content-type'));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Server error:", errorText);
        throw new Error(`Server error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Response data:", data);

      // Logique de redirection selon ton plan original
      if (data.url) {
        window.location.href = data.url;
      } else if (data.id) {
        await stripe.redirectToCheckout({ sessionId: data.id });
      } else {
        throw new Error("Aucune URL de redirection reçue");
      }

    } catch (error) {
      console.error("❌ Erreur checkout:", error);
      alert(`Erreur lors du paiement: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">🧾 Checkout</h2>
      
      {cartItems.length === 0 ? (
        <div className="text-center">
          <h4>Votre panier est vide</h4>
          <p>Ajoutez des produits avant de procéder au paiement.</p>
        </div>
      ) : (
        <div className="row">
          {/* Formulaire de livraison */}
          <div className="col-md-6">
            <form onSubmit={handlePayment}>
              <h4 className="mb-3">📍 Informations de livraison</h4>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Prénom *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nom *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Téléphone *</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+33 6 12 34 56 78"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Adresse *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="123 Rue de la Paix"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Code postal *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="75001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Redirection...
                  </>
                ) : (
                  "💳 Payer avec Stripe"
                )}
              </button>
            </form>
          </div>

          {/* Récapitulatif de la commande */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h4 className="mb-0">🛍️ Récapitulatif de la commande</h4>
              </div>
              <ul className="list-group list-group-flush">
                {cartItems.map((item) => (
                  <li
                    key={item._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={`http://localhost:8000/${item.images?.[0] || item.image}`}
                        alt={item.name}
                        className="me-3"
                        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                      />
                      <div>
                        <strong>{item.name}</strong><br />
                        <small className="text-muted">
                          {item.quantity} × £{parseFloat(item.price).toFixed(2)}
                        </small>
                      </div>
                    </div>
                    <span className="fw-bold">
                      £{(item.quantity * item.price).toFixed(2)}
                    </span>
                  </li>
                ))}
                
                <li className="list-group-item d-flex justify-content-between">
                  <span>Sous-total</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </li>
                
                <li className="list-group-item d-flex justify-content-between">
                  <span>Frais de livraison</span>
                  <span>£{deliveryFee.toFixed(2)}</span>
                </li>
                
                <li className="list-group-item d-flex justify-content-between bg-light">
                  <strong>Total</strong>
                  <strong className="text-primary">£{total.toFixed(2)}</strong>
                </li>
              </ul>
              
              <div className="card-body">
                <small className="text-muted">
                  🔒 Paiement sécurisé avec Stripe<br />
                  📧 Vous recevrez une confirmation par email<br />
                  🚚 Livraison sous 2-3 jours ouvrés
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;