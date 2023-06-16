const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;
const jwt = require("jsonwebtoken");
passport.use(jwtStrategy);

/* GET posts. */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }, (req, res) => {
    return res.send("this is a protected route");
  })
);

module.exports = router;
