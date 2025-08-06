const nodemailer = require('nodemailer');
const generateInvoice = require('./generateInvoice');

const sendOrderConfirmation = async (to, order) => {
  try {
    console.log("📨 sendOrderConfirmation called for:", to);

    const invoicePath = generateInvoice(order); // Génère le PDF

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
      subject: 'Your order has been confirmed ✔️',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #4CAF50;">✅ Thank you for your order!</h2>
          
          <p>Hello <strong>${order.customer?.lastName || ''}</strong>,</p>
          
          <p>We’re happy to let you know that we’ve received your order. You’ll find your invoice attached to this email.</p>

          <h3 style="color: #333;">🧾 Order Summary</h3>
          <ul style="padding-left: 20px; line-height: 1.5;">
            ${ (order.orders || order.products || []).map(p => `
              <li>${p.name} × ${p.quantity} – ${(p.price * p.quantity).toFixed(2)} €</li>
            `).join('') }
          </ul>

          <p style="font-size: 16px; font-weight: bold;">💰 Total: ${(order.total || order.totalAmount).toFixed(2)} €</p>

          <p style="margin-top: 30px;">If you have any questions, feel free to contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>.</p>
          
          <hr style="margin: 30px 0;" />
          <p style="font-size: 12px; color: #888;">Please do not reply to this email. This mailbox is not monitored.</p>
        </div>
      `,
      attachments: [
        {
          filename: `invoice-${order._id}.pdf`,
          path: invoicePath,
        }
      ]
    };
    await transporter.sendMail(mailOptions);
    console.log("📧 Email with invoice sent to", to);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
};

module.exports = sendOrderConfirmation;
