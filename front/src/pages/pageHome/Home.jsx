import React, { useEffect, useState } from "react";
import axios from "axios";
import URL from "../../utils/constants/url";
import { Link } from "react-router";
import templates from "../../assets/img/16_templates.jpg";
import palmiers from "../../assets/img/Collage_palmiers.jpg";
import coqRecyclage from "../../assets/img/Collage_coq_recyclage.jpg";
import papillons from "../../assets/img/Collage_papillons.jpg";
import poisson from "../../assets/img/Collage_poisson.jpg";

const Home = () => {
  
  const [promoProduct, setPromoProduct] = useState(null);

  useEffect(() => {
    const fetchPromo = async () => {
      
      
      try {
        const res = await axios.get(URL.GET_ALL_PRODUCT);
        console.log(res);
        
        const promos = res.data.filter(
          (product) => product.promo && product.promo < product.price
        );
        if (promos.length > 0) {
          setPromoProduct(promos[0]);
        }
      } catch (error) {
        console.error("Erreur chargement promo", error);
      }
    };

    fetchPromo();
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>Create perfect paper crafts.</h1>
          <p>Creative punches + free design templates. Simple, beautiful, inspiring.</p>
          <a href="#" className="cta-button">Explore the Bundle</a>
        </div>
      </section>

      {/* TEMPLATES */}
      <section className="templates">
        <div className="templates-content">
          <img src={templates} alt="Creative Templates" className="templates-img" />
          <div className="templates-text">
            <h2>16 Creative Templates Included</h2>
            <p>Stick the shapes made with CreatCut tools. Color them. Create your own art.</p>
            <a href="#" className="cta-button dark">Browse Templates</a>
          </div>
        </div>
      </section>

      {/* INSPIRATION */}
      <section className="collage-gallery">
        <h2>Be Inspired by Our Collages</h2>
        <p className="gallery-intro">Here are some creative ideas made using Graphidel tools.</p>
        <div className="collage-grid">
          <img src={palmiers} alt="Palm Trees Collage" />
          <img src={coqRecyclage} alt="Recycled Rooster" />
          <img src={papillons} alt="Butterflies" />
          <img src={poisson} alt="Fish Collage" />
        </div>
        <a href="#" className="cta-button dark">View All Collages</a>
      </section>

      {/* DYNAMIC PROMO SECTION */}
      {promoProduct && (
        <section className="promo-highlight">
          <h2>🔥 Current Promotions</h2>

          <div className="promo-card">
            <img
              src={`http://localhost:8000/${promoProduct.images?.[0] || promoProduct.image}`}
              alt={promoProduct.name}
              className="promo-image"
            />
            <div className="promo-content">
              <h3 className="promo-title">{promoProduct.name}</h3>
              <p className="promo-price">
                <span className="old-price">£{parseFloat(promoProduct.price).toFixed(2)}</span>
                <span className="new-price">£{parseFloat(promoProduct.promo).toFixed(2)}</span>
              </p>
              <Link to={`/product/show/${promoProduct._id}`} className="btn btn-dark " style={{width:"10rem",borderRadius:"1rem"}}>
                View Product
              </Link>
            </div>
          </div>
        <div>
          <Link to="/shop" className="cta-button dark btn btn-dark text-center" style={{ marginTop: "30px" }}>
            View All Products
          </Link>
          </div>

        </section>
      )}
    </>
  );
};

export default Home;
