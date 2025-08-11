// mail/sendOrderShipped.js
const nodemailer = require('nodemailer');

const sendOrderShipped = async (to, order) => {
  try {
    console.log("📨 sendOrderShipped called for:", to);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Kindergarten School" <${process.env.EMAIL_USER}>`,
      to,
      subject: '📦 Your order has been shipped!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #4CAF50;">🚚 Your order is on the way!</h2>
          
          <p>Hello <strong>${order.customer?.lastName || ''}</strong>,</p>
          
          <p>We’re happy to let you know that your order has been shipped. It should arrive soon!</p>

          <h3 style="color: #333;">🧾 Order Summary</h3>
          <ul style="padding-left: 20px; line-height: 1.5;">
            ${ (order.orders || order.products || []).map(p => `
              <li>${p.name} × ${p.quantity} – ${(p.price * p.quantity).toFixed(2)} £</li>
            `).join('') }
          </ul>

          <p style="font-size: 16px; font-weight: bold;">💰 Total: ${(order.total || order.totalAmount).toFixed(2)} £</p>

          <p style="margin-top: 30px;">If you have any questions, feel free to contact us at 
            <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>.
          </p>
          
          <hr style="margin: 30px 0;" />
          <p style="font-size: 12px; color: #888;">Please do not reply to this email. This mailbox is not monitored.</p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log("📧 Shipping email sent to", to);
  } catch (err) {
    console.error("❌ Error sending shipped email:", err);
  }
};

module.exports = sendOrderShipped;
