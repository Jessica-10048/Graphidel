import React from "react";
import templates from "../../assets/img/16_templates.jpg";
import palmiers from "../../assets/img/Collage_palmiers.jpg";
import coqRecyclage from "../../assets/img/Collage_coq_recyclage.jpg";
import papillons from "../../assets/img/Collage_papillons.jpg";
import poisson from "../../assets/img/Collage_poisson.jpg";
import DSC08657 from "../../assets/img/5cm/DSC08657.jpg";
import DSC08653 from "../../assets/img/2.5cm/DSC08653.jpg";
import { Link } from "react-router";
const Home = () => {
  return (
    <>
      {/* <!-- HERO SECTION --> */}
      <section className="hero">
        <div className="hero-content">
          <h1>Create perfect paper crafts.</h1>
          <p>
            Creative punches + free design templates. Simple, beautiful,
            inspiring.
          </p>
          <a href="#" className="cta-button">
            Explore the Bundle
          </a>
        </div>
      </section>
      {/* <!-- TEMPLATES SECTION --> */}
      <section className="templates">
        <div className="templates-content">
          <img
            src={templates}
            alt="Creative Templates"
            className="templates-img"
          />
          <div className="templates-text">
            <h2>16 Creative Templates Included</h2>
            <p>
              Stick the shapes made with CreatCut tools. Color them. Create your
              own art.
            </p>
            <a href="#" className="cta-button dark">
              Browse Templates
            </a>
          </div>
        </div>
      </section>
      {/* <!-- INSPIRATION COLLAGES SECTION -->  */}
      <section className="collage-gallery">
        <h2>Be Inspired by Our Collages</h2>
        <p className="gallery-intro">
          Here are some creative ideas made using Graphidel tools. Tap the
          button to see more free collage templates!
        </p>
        <div className="collage-grid">
          <img src={palmiers} alt="Palm Trees Collage" />
          <img src={coqRecyclage} alt="Recycled Rooster" />
          <img src={papillons} alt="Butterflies" />
          <img src={poisson} alt="Fish Collage" />
        </div>{" "}
        <a href="#" className="cta-button dark">
          View All Collages
        </a>
      </section>
      {/* <!-- PRODUCT SECTION: OUR PAPERCRAFTS -->  */}
      <section className="product-section">
        <h2>Our Papercrafts</h2>
        <div className="product-gallery">
          <div className="product-card">
            <img src={DSC08657} alt="5cm Punch Tool" />
            <h3>Collage activities with CreatCut punch - 5cm circle</h3>
            <p className="price">£23.99</p>
            <Link
              to="/product/show/6890cc555054353854a5187f"
              className="cta-button dark"
            >
              View Product
            </Link>
          </div>
          {/* <!-- Placeholder for 2nd product in future --> */}
          <div className="product-card">
            <img src={DSC08653} alt="5cm Punch Tool" />
            <h3>Collage activities with a CreatCut punch - circle of 2,5cm</h3>
            <p className="price">£15</p>
            <Link
              to="/product/show/6890cc6c5054353854a51881"
              className="cta-button dark"
            >
              View Product
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
