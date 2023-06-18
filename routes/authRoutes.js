const express = require('express');
const router = express.Router();

const authController = require('../controllers/authControllers')

router.get('/', (req,res)=>{
  res.render('index', {title: 'Auth with JWT'})
})
router.get('/login', authController.login_get);
router.post('/login',authController.login_post);
router.get('/signup',authController.signup_get)
router.post('/signup', authController.signup_post)

module.exports = router;
