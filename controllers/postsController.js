const Post = require("../models/post");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

/* GET POSTS / */
module.exports.posts_get = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("author").exec();
  res.json({
    message: "GET request on posts page. | (Not protected route)",
    posts,
  });
});
/* GET NEW /new */
module.exports.create_get = (req, res) => {
  jwt.verify(req.token, process.env.secret, (authErr, authData) => {
    if (authErr) {
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
/* POST NEW /new */
module.exports.create_post = [
  // Validation logic and sanitizing. - maybe gotta add length stuff
  body("title", "Title is required").trim().escape(),
  body("text", "Text is required").trim().escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const { title, text } = req.body;
    jwt.verify(req.token, process.env.secret, async (authErr, authData) => {
      if (authErr) {
        res.sendStatus(403);
      } else {
        const userId = authData.id;
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
            message:
              "Error found while validating post fields - will have to redirect to the new post page with sanitized",
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

/* GET POST /:id */
module.exports.post_get = asyncHandler(async (req, res, next) => {
  // This will be for the page of each individual post, where people can comment
  const err = new Error("Post was not found.");
  err.status = 404;
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    const post = await Post.findById(req.params.id).exec();
    post === null
      ? next(err)
      : res.json({
          message: "GET req of one singular post id. | (Not protected)",
          post,
        });
  }
  next(err);
});

/* POST COMMENT /:id */
module.exports.comment_post = [
  // Validation logic and sanitizing
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
    }
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
  }),
];

/* GET UPDATE '/:id/update' */
module.exports.update_get = asyncHandler(async (req, res, next) => {
  //protected route
  jwt.verify(req.token, process.env.secret, async (authErr, authData) => {
    if (authErr) {
      res.sendStatus(403);
    } else {
      const err = new Error("Post was not found.");
      err.status = 404;
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        const post = await Post.findById(req.params.id).exec();
        //also Im pretty sure I will have to "unescape()" the values over here sigh - always a pain but im 100% sure i gotta
        post === null
          ? next(err)
          : res.json({
              message:
                "GET req of one singular post id on the update page. | (Is protected)",
              info: "Important: This call will be done on a form page, where the fields will be sanitized with the values of the post I just retrieved from the db",
              post,
            });
      }
      next(err);
    }
  });
});

/* PUT UPDATE '/:id/update' */
module.exports.update_put = [
  body("title").trim().escape(),
  body("text").trim().escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const { title, text, published } = req.body;
    jwt.verify(req.token, process.env.secret, async (authErr, authData) => {
      if (authErr) {
        res.sendStatus(403);
      } else {
        const initialPost = await Post.findById(req.params.id).exec();
        const userId = data.id;
        const user = await User.findById(userId).exec();
        const updatedPost = new Post({
          _id: req.params.id,
          title,
          text,
          comments: initialPost.comments,
          author: user,
          published,
        });
        if (!errors.isEmpty()) {
          res.json({
            message:
              "Error found while validating update post fields - will have to redirect to the update post page with sanitized",
            errors: errors.array(),
            updatedPost,
          });
          return;
        }
        await Post.findByIdAndUpdate(req.params.id, updatedPost);
        res.json({
          updatedPost,
          param: req.params.id,
          message:
            "PUT req of one singular post id on the update page was successful - now redirect to normal /:id get post page. | (Is protected)",
        });
      }
    });
  }),
];

/* */
module.exports.post_delete = asyncHandler(async (req, res, next) => {
  jwt.verify(req.token, process.env.secret, async (authErr, authData) => {
    if (authErr) {
      res.sendStatus(403);
    }
    const error = new Error("Post was not found.");
    error.status = 404;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      const post = await Post.findById(req.params.id).exec();
      if (post === null) {
        next(error);
      }
      await post.deleteOne();
      res.json({
        message:
          "DELETE req of one singular post id. - now redirect to normal /posts get post page. | (Is protected)",
      });
    }
    next(error);
  });
});
