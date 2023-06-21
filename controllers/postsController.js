const Post = require("../models/post");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

module.exports.posts_get = (req, res) => {
  jwt.verify(req.token, process.env.secret, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({ message: "protected route, get request", authData });
    }
  });
};

module.exports.posts_post = (req, res) => {
  console.log(req.body);
  res.json({message: 'im seding my posts', body: req.body})
  //   jwt.verify(req.token, process.env.secret, (err, data) => {
  //     if (err) {
  //       res.sendStatus(403);
  //     } else {
  //       res.json({
  //         message: "Just did a POST request from a protected route yey",
  //         body: req.body,
  //         my_name: data.first_name,
  //       });
  //     }
  //   });
};
