import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import URL from "../../utils/constants/url";
import { useAuth } from "../../utils/context/AuthContext"; // Si tu veux connecter automatiquement après inscription

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // facultatif : connecter auto après inscription

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(URL.POST_USER_REGISTER, form);
      // Facultatif : connecter directement l'utilisateur
      login(res.data.user);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'inscription.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <form className="form-register" onSubmit={handleSubmit}>
        <h2>📝 Register</h2>
        <p>Create your account to join our creative community.</p>

        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="cta-button">Register</button>

        <div className="form-footer">
          <p>Already have an account? <a href="/login">Log in</a></p>
        </div>
      </form>
    </div>
  );
};
export default Register;
