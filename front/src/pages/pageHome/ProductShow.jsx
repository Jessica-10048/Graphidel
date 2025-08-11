import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import URL from "../../utils/constants/url";
import { useCart } from "../../utils/context/CartContext";

const ProductShow = () => {
  const { id } = useParams(); // récupère l'id depuis l'URL
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${URL.GET_PRODUCT}/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du produit", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p>Chargement du produit...</p>;
  console.log(product);
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={`http://localhost:8000/${
              product.images?.[0] || product.image
            }`}
            alt={product.name}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="text-muted">
            {product.description || "Pas de description."}
          </p>

          {/* 💰 Affichage des prix */}
          <div className="d-flex align-items-center">
            <span
              style={{
                textDecoration: "line-through",
                color: "#888",
                marginRight: "8px",
              }}
            >
              £{parseFloat(product.price).toFixed(2)}
            </span>
            {product.discount > 0 && (
              <span className="badge bg-danger me-2">-{product.discount}%</span>
            )}
            <span style={{ color: "red", fontWeight: "bold" }}>
              £{parseFloat(product.promo).toFixed(2)}
            </span>
          </div>

          <button
            className="btn btn-primary mt-3"
            onClick={() => addToCart(product)}
          >
            🛒 Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductShow;
