const Newsletter = require("../models/newsletter.model"); // Modèle des abonnés
const NewsletterContent = require("../models/newsletterContent.model"); // Modèle des contenus de newsletter
const nodemailer = require("nodemailer");


// ─────────────────────────────────────────────
// 📩 SECTION 1 : CRUD sur les newsletters
// ─────────────────────────────────────────────

// ✅ Créer une newsletter
const createNewsletter = async (req, res) => {
  const { subject, message } = req.body;
  const picture = req.file ? req.file.filename : null;

  try {
    const newNewsletter = new NewsletterContent({ subject, message, picture });
    await newNewsletter.save();
    res.status(201).json({ message: "Newsletter created successfully" });
  } catch (error) {
    console.error("Create newsletter error:", error);
    res.status(500).json({ message: "Failed to create newsletter" });
  }
};

// ✅ Obtenir toutes les newsletters
const getAllNewsletters = async (req, res) => {
  try {
    const newsletters = await NewsletterContent.find().sort({ createdAt: -1 });
    res.json(newsletters);
  } catch (error) {
    console.error("Get newsletters error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Voir une newsletter par ID
const getNewsletterById = async (req, res) => {
  try {
    const newsletter = await NewsletterContent.findById(req.params.id);
    if (!newsletter) return res.status(404).json({ message: "Not found" });
    res.json(newsletter);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Modifier une newsletter
const updateNewsletter = async (req, res) => {
  const { subject, message } = req.body;
  const picture = req.file ? req.file.filename : null;

  try {
    const updated = await NewsletterContent.findByIdAndUpdate(
      req.params.id,
      { subject, message, ...(picture && { picture }) },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update error" });
  }
};

// ✅ Supprimer une newsletter
const deleteNewsletter = async (req, res) => {
  try {
    await NewsletterContent.findByIdAndDelete(req.params.id);
    res.json({ message: "Newsletter deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete error" });
  }
};


// ─────────────────────────────────────────────
// 👥 SECTION 2 : Gestion des abonnés (subscribers)
// ─────────────────────────────────────────────

// ✅ Ajouter un abonné
const addSubscriber = async (req, res) => {
  const { email } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    const newSubscriber = new Newsletter({ email, image });
    await newSubscriber.save();

    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Add subscriber error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Obtenir tous les abonnés
const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (error) {
    console.error("Get subscribers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Supprimer un abonné
const deleteSubscriber = async (req, res) => {
  try {
    const deleted = await Newsletter.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Subscriber not found" });
    }
    res.json({ message: "Subscriber deleted" });
  } catch (err) {
    console.error("Delete subscriber error:", err);
    res.status(500).json({ message: "Error deleting subscriber" });
  }
};


// ─────────────────────────────────────────────
// 📤 SECTION 3 : Envoi de newsletter
// ─────────────────────────────────────────────

// ✅ Envoyer la newsletter à tous les abonnés
const sendNewsletter = async (req, res) => {
  const { subject, message } = req.body;

  try {
    const subscribers = await Newsletter.find();

    const transporter = nodemailer.createTransport({
      service: "gmail", // Adapter selon ton provider (Mailtrap, Sendinblue, etc.)
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    for (const subscriber of subscribers) {
      await transporter.sendMail({
        from: `"L'école" <${process.env.MAIL_USER}>`,
        to: subscriber.email,
        subject,
        html: `<p>${message}</p>`,
      });
    }

    res.json({ message: "Newsletter sent to all subscribers." });
  } catch (error) {
    console.error("Send newsletter error:", error);
    res.status(500).json({ message: "Failed to send newsletter." });
  }
};


// ─────────────────────────────────────────────
// 📦 Export des fonctions
// ─────────────────────────────────────────────

module.exports = {
  createNewsletter,
  getAllNewsletters,
  getNewsletterById,
  updateNewsletter,
  deleteNewsletter,
  addSubscriber,
  getAllSubscribers,
  deleteSubscriber,
  sendNewsletter,
};
