import React, { useEffect, useState } from "react";
import axios from "axios";
import URL from "../../../utils/constants/url";
import { useNavigate } from "react-router";

const ProductList = () => {
  
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axios.get(URL.GET_ALL_PRODUCT);
      console.log(res);
      
      setProducts(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des produits", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await axios.delete(`${URL.DELETE_PRODUCT}/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
    }
  };

  return (
    <div className="admin-product-list">
      <h2>📦 Product management</h2>
      <button
        className="btn-add"
        onClick={() => navigate("/admin/product/add")}
      >
        ➕ Add a product
      </button>

      <div className="product-admin-grid">
        {products.map((product) => (
          <div key={product._id} className="product-admin-card">
            <img
              src={`http://localhost:8000/${product.images?.[0] || product.image}`}
              alt={product.name}
              className="admin-product-image"
            />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>
                {product.promo && product.promo < product.price ? (
                  <>
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#888",
                        marginRight: "8px",
                      }}
                    >
                      £{parseFloat(product.price).toFixed(2)}
                    </span>
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      £{parseFloat(product.promo).toFixed(2)}{" "}
                      <small style={{ fontSize: "0.8em" }}></small>
                    </span>
                  </>
                ) : (
                  <strong>£{parseFloat(product.price).toFixed(2)}</strong>
                )}
              </p>
            </div>
            <div className="product-actions">
              <button
                onClick={() => navigate(`/admin/product/edit/${product._id}`)}
              >
                ✏️ Edit
              </button>
              <button onClick={() => handleDelete(product._id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
