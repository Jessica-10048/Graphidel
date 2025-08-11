// utils/sendOrderShipped.js
const nodemailer = require('nodemailer');

const sendOrderShipped = async (to, order) => {
  try {
    console.log("📨 sendOrderShipped called for:", to);

    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Graphidel" <${process.env.EMAIL_USER}>`,
      to,
      subject: '🚚 Votre commande est en route !',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #4CAF50;">🚚 Votre commande est en route !</h2>
          
          <p>Bonjour <strong>${order.customer?.firstName || ''} ${order.customer?.lastName || ''}</strong>,</p>
          
          <p>Excellente nouvelle ! Votre commande <strong>#${order._id}</strong> a été expédiée et est maintenant en route vers vous.</p>

          ${order.trackingNumber ? `
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">📋 Informations de suivi</h3>
              <p><strong>Numéro de suivi :</strong> ${order.trackingNumber}</p>
              <p><strong>Livraison estimée :</strong> 2-3 jours ouvrés</p>
            </div>
          ` : ''}

          <h3 style="color: #333;">🧾 Récapitulatif de votre commande</h3>
          <ul style="padding-left: 20px; line-height: 1.5;">
            ${ (order.orders || order.products || []).map(p => `
              <li>${p.name} × ${p.quantity} – £${(p.price * p.quantity).toFixed(2)}</li>
            `).join('') }
          </ul>

          <p style="font-size: 16px; font-weight: bold;">💰 Total: £${(order.total || order.totalAmount || 0).toFixed(2)}</p>

          ${order.trackingNumber ? `
            <p>Vous pouvez suivre votre colis en temps réel avec le numéro de suivi ci-dessus.</p>
          ` : ''}

          <p style="margin-top: 30px;">Si vous avez des questions, n'hésitez pas à nous contacter à 
            <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>.
          </p>
          
          <p>Merci pour votre confiance ! 🙏</p>
          
          <hr style="margin: 30px 0;" />
          <p style="font-size: 12px; color: #888;">Veuillez ne pas répondre à cet email. Cette boîte mail n'est pas surveillée.</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log("📧 Email d'expédition envoyé à", to);
  } catch (err) {
    console.error("❌ Erreur envoi email expédition:", err);
  }
};

module.exports = sendOrderShipped;