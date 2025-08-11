import React from 'react';
import { Link } from 'react-router';

const Dashboard = () => {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">👩‍💻 Administrator Dashboard</h1>

      <div className="row row-cols-1 row-cols-md-2 g-4">

        {/* Ajouter un produit */}
        <div className="col">
          <div className="card h-100 shadow-sm border-primary">
            <div className="card-body text-center">
              <h5 className="card-title">➕ Add a product</h5>
              <p className="card-text">Add a new product to your store.</p>
              <Link to="/admin/product/add" className="btn btn-outline-primary">
                Add Product
              </Link>
            </div>
          </div>
        </div>

        {/* Gérer les produits */}
        <div className="col">
          <div className="card h-100 shadow-sm border-success">
            <div className="card-body text-center">
              <h5 className="card-title">📦 Manage products</h5>
              <p className="card-text">Edit or delete existing products.</p>
              <Link to="/admin/products" className="btn btn-outline-success">
                Manage Products
              </Link>
            </div>
          </div>
        </div>

        {/* Voir les commandes */}
        <div className="col">
          <div className="card h-100 shadow-sm border-warning">
            <div className="card-body text-center">
              <h5 className="card-title">🧾 See orders</h5>
              <p className="card-text">View customer orders and details.</p>
              <Link to="/admin/orders" className="btn btn-outline-warning">
                View Orders
              </Link>
            </div>
          </div>
        </div>

        {/* Gérer la newsletter */}
        <div className="col">
          <div className="card h-100 shadow-sm border-info">
            <div className="card-body text-center">
              <h5 className="card-title">📩 Manage Newsletter</h5>
              <p className="card-text">Handle newsletter subscriptions.</p>
              <Link to="/admin/newsletter" className="btn btn-outline-info">
                Newsletter
              </Link>
            </div>
          </div>
        </div>

        {/* Gérer les membres */}
        <div className="col">
          <div className="card h-100 shadow-sm border-dark">
            <div className="card-body text-center">
              <h5 className="card-title">👥 Manage Members</h5>
              <p className="card-text">View, promote or delete registered users.</p>
              <Link to="/admin/members" className="btn btn-outline-dark">
                Manage Members
              </Link>
            </div>
          </div>
        </div>
        {/* Gérer les templates */}
        <div className="col">
          <div className="card h-100 shadow-sm border-dark">
            <div className="card-body text-center">
              <h5 className="card-title">🎨 Manage Templates</h5>
              <p className="card-text">View, edit, or delete templates.</p>
              <Link to="/admin/template" className="btn btn-outline-dark">
                Manage Templates
              </Link>
            </div>
          </div>
        </div>

      </div>

      <p className="text-center mt-4 text-muted">
        Welcome to the administration area. Choose an action above.
      </p>
    </div>
  );
};

export default Dashboard;
