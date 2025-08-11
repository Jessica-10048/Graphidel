import React from "react";
import { NavLink, useNavigate } from "react-router"; 
import logoGraphidel from "../../assets/img/logo.jpg";
import { CiHeart } from "react-icons/ci";
import { useCart } from "../../utils/context/CartContext";
import { useAuth } from "../../utils/context/AuthContext";

const Header = () => {
  const { cartItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo">
        <img src={logoGraphidel} alt="Graphidel Logo" />
      </div>

      <nav className="nav-links">
        <NavLink to="/" end>🏠 Home</NavLink>
        <NavLink to="/about">ℹ️ About</NavLink>
        <NavLink to="/shop">👜 Shop</NavLink>
        <NavLink to="/contact">✉️ Contact</NavLink>
      </nav>

      <div className="header-icons">
        {isAuthenticated ? (
          <>
            <div className="dropdown">
              <button
                className="btn btn-light dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                👤 {user.firstName}
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow animated-dropdown">
                {user.role === "admin" && (
                  <li>
                    <NavLink className="dropdown-item" to="/admin/dashboard">
                      Back office
                    </NavLink>
                  </li>
                )}
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/favourites">
                    <CiHeart /> My Favourites
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item position-relative" to="/cart">
                    🛒 My Cart
                    {totalQuantity > 0 && (
                      <span className="badge bg-danger rounded-pill ms-2">
                        {totalQuantity}
                      </span>
                    )}
                  </NavLink>
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                  >
                    🚪 Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <NavLink to="/login">👤 Login</NavLink>
            <NavLink to="/register">📝 Register</NavLink>
            <NavLink to="/cart" className="position-relative">
              🛒 My Cart
              {totalQuantity > 0 && (
                <span className="badge bg-danger rounded-pill ms-2">
                  {totalQuantity}
                </span>
              )}
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
