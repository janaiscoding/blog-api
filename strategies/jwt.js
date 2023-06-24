const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config();
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.secret,
};

module.exports = new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    return done(null, jwt_payload);
  } catch (error) {
    done(error);
  }
});
