const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
require("dotenv").config();
const passport = require("passport");
const User = require("./models/user");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secret;

module.exports = new JwtStrategy(opts, async (payload, done) => {
  const user = await User.findOne({ email: payload.email });
  if (user) {
    return done(null, user);
  }
  return done(null, false, { message: "User does not exist" });
});