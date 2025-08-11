const express = require("express");
const router = express.Router();
const newsletterController = require("../controllers/newsletter.controller");
const upload = require("../middleware/upload");

// ✅ 1. Abonnés (subscribers)
router.post("/add", newsletterController.addSubscriber);               
router.get("/subscribers", newsletterController.getAllSubscribers);   
router.delete("/subscriber/:id", newsletterController.deleteSubscriber); 

// ✅ 2. Newsletters
router.post("/create", upload.single("picture"), newsletterController.createNewsletter);
router.get("/all", newsletterController.getAllNewsletters);                             
router.get("/get/:id", newsletterController.getNewsletterById);                         
router.put("/update/:id", upload.single("picture"), newsletterController.updateNewsletter); 
router.delete("/delete/:id", newsletterController.deleteNewsletter);                    


// ✅ 3. Envoi de newsletter
router.post("/send", newsletterController.sendNewsletter); // Envoi groupé à tous les abonnés

module.exports = router;
