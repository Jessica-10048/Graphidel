const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/user.controller");

router.post("/register", register);
router.post("/sign", login);

module.exports = router;
