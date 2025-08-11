import React, { useState } from 'react';
import { Link } from 'react-router';
import { FaArrowRight } from "react-icons/fa6";
import axios from "axios";
import URL from '../../utils/constants/url';

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(URL.POST_NEWSLETTER, { email });
      setMessage("✅ Successfully subscribed!");
      setEmail("");
    } catch (err) {
      setMessage("❌ This email is already subscribed or invalid.");
    }

    // Message timeout (optionnel)
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Newsletter signup */}
        <div className="newsletter">
          <h3>Stay in the loop</h3>
          <p>Get free templates, updates, and creative tips from Graphidel.</p>
          
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">
              <FaArrowRight />
            </button>
          </form>

          {message && <small className="text-success d-block mt-2">{message}</small>}
          
          <small>
            By signing up, you agree to our
            <Link to="/privacy"> Privacy </Link> and
            <Link to="/terms"> Terms</Link>.
          </small>
        </div>

        {/* Footer nav */}
        <div className="footer-links">
          <Link to="/about">ℹ️ About</Link>
          <Link to="/shop">🛒 Shipping</Link>
          <Link to="/terms">📜 Terms</Link>
          <Link to="/privacy">🔒 Privacy</Link>
          <Link to="/contact">✉️ Contact</Link>
        </div>

        <p className="copyright">© 2025 Graphidel. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
