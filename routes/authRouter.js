const express = require("express");
const router = express.Router();

const authController = require("../controllers/authControllers");
router.get('/', (req,res)=>{
    res.status(200).json({message: "Testing"})
})
router.post("/login", authController.login_post);
router.post("/signup", authController.signup_post);

module.exports = router;
