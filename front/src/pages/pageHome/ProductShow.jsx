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

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={`http://localhost:8000/${product.image}`}
            alt={product.name}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="text-muted">{product.description || "Pas de description."}</p>
          <h4>{product.price} €</h4>

          <button className="btn btn-primary" onClick={() => addToCart(product)}>
            🛒 Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductShow;
