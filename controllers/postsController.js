const Post = require("../models/post");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

module.exports.posts_get = asyncHandler(async (req, res) => {
  const posts = await Post.find();
  res.json({
    message: "GET request on posts page",
    info: "This is not a protected route",
    posts,
  });
});

module.exports.singular_post_get = (req, res) => {
  const id = req.params.id;
  res.json({ message: "GET req of one singular post id",info:"not protected", id });
};

module.exports.singular_post_comment_post = [
  body("text").trim().isAlphanumeric().escape(),
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    res.json({ message: "POST request on comment on one singular post",info:"not protected", id });
  }),
];

module.exports.new_post_get = (req, res) => {
  jwt.verify(req.token, process.env.secret, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "GET req for a form where we can get the new post data",
        info: "This is a protected route",
        authData,
      });
    }
  });
};

module.exports.new_post_post = [
  body("title", "Title is required").trim().isAlphanumeric().escape(),
  body("text", "Text is required").trim().isAlphanumeric().escape(),
  asyncHandler(async (req, res) => {
    jwt.verify(req.token, process.env.secret, (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const { title, text } = req.body;
        console.log(title, text);
        res.json({
          message: "Just did a POST request from a protected route yey",
          my_name: data.first_name,
          title,
          text,
        });
      }
    });
  }),
];
