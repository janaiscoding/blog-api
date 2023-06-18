// to create a new user i must: validate and sanitize the user inputed data
// create an async request to do database - checking if the user already exists
// hashing the password
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};
module.exports.signup_post = [
  body("email", "Email is required").trim().isEmail().escape(),
  body("first_name", "First name is required").trim().isAlphanumeric().escape(),
  body("last_name", "Last name is required").trim().isAlphanumeric().escape(),
  body("password", "Password is required, and needs to be between 8 and 24 characters long")
    .trim()
    .isLength({ min: 8, max: 24 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    //Find out if the validation constraints return any errors
    const errors = validationResult(req);
    const { first_name, last_name, email, password } = req.body;
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      //in case something happens during hashing
      if (err) {
        console.log(err);
      } else {
        //if hashing is successful
        //1.make user
        const user = new User({
          first_name,
          last_name,
          email,
          password: hashedPassword,
          author_status: true,
        });
        //2. check all the constraints
        if (!errors.isEmpty()) {
          //found errros, let's re-hydrate user's form with old values
          res.render("signup", {
            user,
            errors: errors.array(),
          });
          return;
        } else {
          // everything went well, lets make the user
          await user.save();
          res.redirect("/login");
        }
      }
    });
  }),
];

module.exports.login_post = (req, res) => {
  const { email, password } = req.body;
  console.log("email", email, "password", password);
  res.send("new post request for login form");
};
