const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config();
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.secret,
};

module.exports = new JwtStrategy(opts, (jwt_payload, done) => {
  console.log(opts.jwtFromRequest);
  console.log("look at my strat my strat is amazing", jwt_payload);
  if (jwt_payload.email === "test1@gmail.com") {
    return done(null, true);
  } else {
    console.log("bruh moment");
    return done(null, false);
  }
});
