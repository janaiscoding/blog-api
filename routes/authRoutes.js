const express = require("express");
const router = express.Router();

const authController = require("../controllers/authControllers");

router.post("/login", authController.login_post);
router.post("/signup", authController.signup_post);

module.exports = router;
