import React from 'react';

const Contact = () => {
  return (
    <section className="contact-form">
      <div className="form-card">
        <h2>Contact Us</h2>
        <p>Have a question ? Fill out the form below!</p>
        <form>
          <div className="form-group">
            <label  htmlFor="name">Name : </label>
            <input type="text" placeholder="Your Name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email : </label>
            <input type="email" placeholder="Your Email" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message :</label>
            <textarea placeholder="Your Message" rows="5" required></textarea>
          </div>
          <button type="submit" className="cta-button dark">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
