const mongoose = require("mongoose");

const newsletterContentSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  message: { type: String, required: true },
  picture: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("NewsletterContent", newsletterContentSchema);
