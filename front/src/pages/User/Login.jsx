import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "../../utils/context/AuthContext"; // 🔐 Ton contexte Auth
import URL from "../../utils/constants/url"; // ton endpoint login

const Login = () => {
  const { login } = useAuth(); // méthode pour enregistrer l'utilisateur dans le contexte
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(URL.AUTH_LOGIN, form);
      console.log("✅ Données de réponse du backend :", res.data); 
      login(res.data.user); // sauvegarde utilisateur dans le contexte
      navigate("/"); // redirection vers l'accueil
    } catch (err) {
      console.error(err);
      setError("Échec de la connexion. Vérifie tes identifiants.");
    }
  };

  return (
   
 <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <form onSubmit={handleSubmit} className="form-register">
        <h2>🔐 Login</h2>
        <p>Welcome back! Please log in to your account.</p>

        <div className="form-group">
          <label>Email address</label>
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

        <button type="submit" className="cta-button">Log in</button>

        <div className="form-footer">
          <p>Don't have an account yet? <a href="/register">Register</a></p>
        </div>
      </form>
    </div>
  );
};
export default Login;
