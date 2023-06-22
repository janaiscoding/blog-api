const Post = require("../models/post");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports.posts_get = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("author").exec();
  res.json({
    message: "GET request on posts page. | (Not protected route)",
    posts,
  });
});

module.exports.singular_post_get = asyncHandler(async (req, res) => {
  // This will be for the page of each individual post, where people can comment
  const post = await Post.findById(req.params.id).exec();
  res.json({
    message: "GET req of one singular post id. | (Not protected)",
    post,
  });
});

module.exports.singular_post_comment_post = [
  // Validation logic and sanitizing. !! Gotta add length constrainers !!
  body(
    "comment",
    "Comment field is required, and must be between 10 and 300 characters long"
  )
    .trim()
    .isLength({ min: 10, max: 300 })
    .escape(),
  body(
    "name",
    "Name field is required, and must be between 3 and 24 characters long"
  )
    .trim()
    .isLength({ min: 3, max: 24 })
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    // Retrieving the post where the user will leave a comment on
    const initialPost = await Post.findById(req.params.id);
    const postComments = initialPost.comments;
    // Retrieve the comment content from req.body
    const { comment, name } = req.body;
    // Create new comment model
    const newComment = new Comment({
      comment,
      name,
    });
    if (!errors.isEmpty()) {
      res.json({
        message: "Error found while validating comment fields",
        errors: errors.array(),
      });
      return;
    } else {
      postComments.push(newComment);
      await newComment.save();
      await Post.findByIdAndUpdate(req.params.id, {
        comments: postComments,
      });
      const updatedPost = await Post.findById(req.params.id).exec();
      res.json({
        message:
          "POST request on comment on one singular post. | (Not protected)",
        updatedPost,
      });
    }
  }),
];

module.exports.new_post_get = (req, res) => {
  jwt.verify(req.token, process.env.secret, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message:
          "GET req for a form where we can get the new post data. | (Protected)",
        authData,
      });
    }
  });
};

module.exports.new_post_post = [
  // Validation logic and sanitizing.
  body("title", "Title is required").trim().escape(),
  body("text", "Text is required").trim().escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const { title, text } = req.body;
    jwt.verify(req.token, process.env.secret, async (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        // JWT connection was verified, Now I am pulling the id from the JWT Token Payload
        const userId = data.id;
        // Find and retrieve user Info from db, so you can pass the reference of the post author
        const user = await User.findById(userId).exec();
        const post = new Post({
          title,
          text,
          author: user,
          published: false,
        });
        if (!errors.isEmpty()) {
          // Found errors, re-render the "form" again with populated and sanitized values, and also error messages
          res.json({
            message: "Error found while validating fields",
            errors: errors.array(),
          });
          return;
        } else {
          await post.save();
          res.json({
            message: "POST request successful! | (Protected)",
            post,
          });
        }
      }
    });
  }),
];
