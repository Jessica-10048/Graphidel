import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import URL from "../../utils/constants/url";

const EditUser = () => {
  const { id } = useParams(); // Récupère l’ID depuis l’URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
  });

  const [error, setError] = useState("");

  // Charger les données de l'utilisateur à éditer
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${URL.GET_USER}/${id}`);
        setForm(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch user:", err);
        setError("Error loading user data.");
      }
    };

    fetchUser();
  }, [id]);

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${URL.UPDATE_USER}/${id}`, form);
      navigate("/admin/members"); // Redirige vers la page des membres
    } catch (err) {
      console.error("❌ Failed to update user:", err);
      setError("Error updating user.");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">✏️ Edit Member</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="firstName" className="form-label">First Name</label>
          <input
            type="text"
            name="firstName"
            className="form-control"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="lastName" className="form-label">Last Name</label>
          <input
            type="text"
            name="lastName"
            className="form-control"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            name="role"
            className="form-select"
            value={form.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">💾 Save Changes</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/admin/members")}>↩️ Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
