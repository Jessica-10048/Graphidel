import React from "react";
import { useCart } from "../../utils/context/CartContext";
import { useNavigate } from 'react-router';
const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
const navigate = useNavigate();
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0)
    return <p className="empty-cart">🛒 Empty cart</p>;
const handleConfirm = () => {
  navigate('/checkout');
};
  return (
    <div className="cart-container">
      <h2>🛍️ Your cart</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div className="cart-item" key={item._id}>
            <img
              src={`http://localhost:8000/${item.image}`}
              alt={item.name}
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p>
                £{item.price}  x {item.quantity}
              </p>
              <button className="btn btn-danger" onClick={() => removeFromCart(item._id)}>
                ❌ Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <h3>Total : £{total.toFixed(2)} </h3>
        <button onClick={handleConfirm} className="btn btn-success">
  ✅ Confirm my order
</button>
        <button onClick={clearCart} className="btn btn-danger gap-1 ">
          🧹 Delete cart{" "}
        </button>
      </div>
    </div>
  );
};

export default Cart;
