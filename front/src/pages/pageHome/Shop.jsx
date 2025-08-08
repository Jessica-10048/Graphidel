import React, { useEffect, useState } from "react";
import axios from "axios";
import URL from "../../utils/constants/url";
import { useCart } from "../../utils/context/CartContext";
import { Link } from "react-router";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(URL.GET_ALL_PRODUCT);
        setProducts(res.data);
      } catch (error) {
        console.error("Error when retrieving products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (products.length === 0) return <p>No products found.</p>;

  const promoProducts = products.filter(
    (product) => product.promo && product.promo < product.price
  );
  const regularProducts = products.filter(
    (product) => !product.promo || product.promo >= product.price
  );

  return (
    <main>
      <h1 className="text-center mb-4">🛍️ Shop</h1>

      {/* 🔥 SECTION PROMO */}
      {promoProducts.length > 0 && (
        <section className="hero bg-warning-subtle py-5">
          <h2 className="text-center fw-bold mb-5 display-5">🔥 Promotions</h2>
          <div className="container">
            <div className="row justify-content-center g-4">
              {promoProducts.map((product) => (
                <div key={product._id} className="col-12 col-sm-6 col-lg-4">
                  <div className="card h-100 border-dark shadow-sm">
                    <img
                      src={`http://localhost:8000/${product.images?.[0] || product.image}`}
                      alt={product.name}
                      className="card-img-top img-fluid"
                      style={{ maxHeight: "250px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-dark fw-bold text-center">
                        {product.name}
                      </h5>
                      <p className="card-text text-muted text-center" style={{ flexGrow: 1 }}>
                        {product.description
                          ? product.description.length > 100
                            ? `${product.description.slice(0, 100)}... `
                            : product.description
                          : "No description available."}
                        {product.description &&
                          product.description.length > 100 && (
                            <Link to={`/product/show/${product._id}`} className="text-primary">
                              (see more details)
                            </Link>
                          )}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#888",
                              marginRight: "8px",
                            }}
                          >
                            £{parseFloat(product.price).toFixed(2)}
                          </span>
                          <span style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}>
                            £{parseFloat(product.promo).toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          className="btn btn-sm btn-outline-primary"
                        >
                          🛒 Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🛍️ SECTION NORMALE */}
      {regularProducts.length > 0 && (
        <section className="p-5">
          <h3 className="text-center mb-4">More Products</h3>
          <div className="container">
            <div className="row justify-content-center g-4">
              {regularProducts.map((product) => (
                <div key={product._id} className="col-12 col-sm-6 col-lg-4">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={`http://localhost:8000/${product.images?.[0] || product.image}`}
                      alt={product.name}
                      className="card-img-top img-fluid"
                      style={{ maxHeight: "250px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text text-muted" style={{ flexGrow: 1 }}>
                        {product.description
                          ? product.description.length > 100
                            ? `${product.description.slice(0, 100)}... `
                            : product.description
                          : "No description available."}
                        {product.description &&
                          product.description.length > 100 && (
                            <Link
                              to={`/product/show/${product._id}`}
                              className="text-primary"
                            >
                              (see more details)
                            </Link>
                          )}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>£{parseFloat(product.price).toFixed(2)}</strong>
                        <button
                          onClick={() => addToCart(product)}
                          className="btn btn-sm btn-outline-primary"
                        >
                          🛒 Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Shop;
