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

  return (
    <main>
      <section className="hero">
        <div className="hero-content-about">
          <h2 className="text-center mb-4">🛍️ Shop</h2>

          <div className="row row-cols-1 row-cols-md-3 g-4">
            {products.map((product) => (
              <div key={product._id} className="col">
                <div className="card h-100 shadow-sm">
                  <img
                    src={`http://localhost:8000/${product.image}`}
                    alt={product.name}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
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
                            style={{ cursor: "pointer" }}
                          >
                            (see more details)
                          </Link>
                        )}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>{product.price} $</strong>
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
    </main>
  );
};

export default Shop;
