// to create a new user i must: validate and sanitize the user inputed data
// create an async request to do database - checking if the user already exists
// hashing the password
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

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
          res.render("signup", {
            user,
            errors: errors.array(),
          });
          return;
        } else {
          await user.save();
          const allusers = await User.find();
          console.log(allusers);
          res.redirect("/login");
        }
      }
    });
  }),
];

module.exports.login_post = [
  body("email", "Email is required").trim().isEmail().escape(),
  body("password", "Password is required")
    .trim()
    .isLength({ min: 8, max: 24 })
    .escape(),
  asyncHandler(async (req, res, done) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) return res.json({ message: "Email is Incorrect" });
    bcrypt.compare(password, user.password, (err, compare) => {
      if (err) return done(err);
      if (compare) {
        const secret = process.env.secret;
        const token = jwt.sign(
          {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            id: user._id,
          },
          secret
        );
        return res.json({
          token,
        });
      } else return res.status(401).json({ message: "Wrong password" });
    });
  }),
];
