const express = require('express');
const router = express.Router();
const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;
const jwt = require("jsonwebtoken");
passport.use(jwtStrategy);

/* GET home page. */
router.get('/', (req, res, next) => {
  res.send('Get request for login')
});


module.exports = router;
