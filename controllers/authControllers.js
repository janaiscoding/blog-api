const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.signup_post = [
  body("email", "Email is required").trim().isEmail().escape(),
  body(
    "first_name",
    "First name is required and it must be between 2 and 24 characters long"
  )
    .trim()
    .isLength({ min: 2, max: 24 })
    .isAlphanumeric()
    .escape(),
  body(
    "last_name",
    "Last name is required and it must be between 2 and 24 characters long"
  )
    .trim()
    .isLength({ min: 2, max: 24 })
    .isAlphanumeric()
    .escape(),
  body(
    "password",
    "Password is required, and needs to be between 8 and 24 characters long"
  )
    .trim()
    .isLength({ min: 8, max: 24 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const { first_name, last_name, email, password } = req.body;
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        console.log(err);
      } else {
        const user = new User({
          first_name,
          last_name,
          email,
          password: hashedPassword,
          author_status: false,
        });
        if (!errors.isEmpty()) {
          res.json({
            errors: errors.array(),
          });
          return;
        } else {
          await user.save();
          res.json({user})
      }
    }
    });
  }),
];

module.exports.login_post = [
  body("email", "A valid email is required").trim().isEmail().escape(),
  body("password", "Password is required and needs to be between 8 and 24 characters long")
    .trim()
    .isLength({ min: 8, max: 24 })
    .escape(),
  asyncHandler(async (req, res, done) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      return res.status(401).json({ errors: errors.array() }); //validation errors
    }
    const user = await User.findOne({ email }).exec();
    if (!user)
      return res.status(404).json({
        message: "Could not find an account associated with this email",
      });

    bcrypt.compare(password, user.password, (err, compare) => {
      if (err) return done(err); 
      if (compare) {
        const opts = {};
        const secret = process.env.secret;
        opts.expiresIn = "1hr";
        const token = jwt.sign({ email: user.email }, secret, opts);
        return res.json({ token, user });
      } else
        return res.status(401).json({ message: "Your password is incorrect" });
    });
  }),
];
