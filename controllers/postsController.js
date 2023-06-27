const Post = require("../models/post");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const validator = require("validator");
module.exports.posts_get = asyncHandler(async (req, res) => {
  const posts = await Post.find();

  if (posts) {
    //Unescaping all posts - need to do it on comments and singular posts also
    posts.map((post) => {
      post.title = validator.unescape(post.title);
      post.text = validator.unescape(post.text);
    });
    res.json({
      message: "GET request on posts page. | (Not protected route)",
      posts,
    });
  } else {
    res.status(404).json({ message: "There are no posts yet" });
  }
});



module.exports.create_post = [
  // Validation logic and sanitizing. - maybe gotta add length stuff
  body("title", "Title is required and needs to be above 3 characters long")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("text", "Text is required and needs to be above 3 characters long")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  asyncHandler(async (req, res) => {
    const { title, text, published } = req.body;
    const errors = validationResult(req);
    const post = new Post({
      title,
      text,
      published,
    });
    if (!errors.isEmpty()) {
      // Found errors, re-render the "form" again with populated and sanitized values, and also error messages
      res.json({
        title,
        text,
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
  }),
];

/* GET POST /:id */
module.exports.post_get = asyncHandler(async (req, res, done) => {
  try {
    const post = await Post.findById(req.params.id).populate("comments").exec(); // Only populating here because this is the only request where comments matter to be displayed
    if (post === null) {
      res.status(404).json({ message: "Post was not found" });
    }
    res.json({
      message:
        "GET req of one singular post id. Populating comments also | (Not protected)",
      //unescaping
      post: {
        title: validator.unescape(post.title),
        text: validator.unescape(post.text),
        comments: post.comments.map((c) => {
          c.comment = validator.unescape(c.comment);
          c.name = validator.unescape(c.name);
          return c;
        }),
      },
    });
  } catch (err) {
    res.status(404).json({ message: "Post was not found", err: err.message });
  }
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
    const { comment, name } = req.body;
    const initialPost = await Post.findById(req.params.id);
    const postComments = initialPost.comments;

    if (!errors.isEmpty()) {
      comment = validator.unescape(comment);
      name = validator.unescape(name);
      res.json({
        message: "Error found while validating comment fields",
        errors: errors.array(),
        comment,
        name,
      });
      return;
    }
    const newComment = new Comment({
      comment,
      name,
    });
    postComments.push(newComment);
    await newComment.save();
    await Post.findByIdAndUpdate(req.params.id, {
      comments: postComments,
    });
    const updatedPost = await Post.findById(req.params.id)
      .populate("comments")
      .exec();

    res.json({
      message:
        "POST request on comment on one singular post. | (Not protected)",
      updatedPost: {
        title: validator.unescape(updatedPost.title),
        text: validator.unescape(updatedPost.text),
        comments: updatedPost.comments,
        comments: updatedPost.comments.map((c) => {
          c.comment = validator.unescape(c.comment);
          c.name = validator.unescape(c.name);
          return c;
        }),
      },
    });
  }),
];

/* PUT UPDATE '/:id' */
module.exports.update_put = [
  body("title", "Title is required and needs to be above 3 characters long")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("text", "Text is required and needs to be above 3 characters long")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const { title, text, published } = req.body;
    const initialPost = await Post.findById(req.params.id).exec();

    const updatedPost = new Post({
      _id: req.params.id,
      title,
      text,
      comments: initialPost.comments,
      published,
    });
    if (!errors.isEmpty()) {
      res.json({
        message:
          "Error found while validating update post fields - will have to redirect to the update post page with sanitized",
        errors: errors.array(),
        updatedPost: {
          _id: req.params.id,
          title: validator.unescape(title),
          text: validator.unescape(text),
          comments: initialPost.comments,
          published,
        },
      });
      return;
    }
    await Post.findByIdAndUpdate(req.params.id, updatedPost);
    res.json({
      updatedPost: {
        _id: req.params.id,
        title: validator.unescape(title),
        text: validator.unescape(text),
        comments: initialPost.comments,
        published,
      },
      param: req.params.id,
      message:
        "PUT req of one singular post id on the update page was successful - now redirect to normal /:id get post page. | (Is protected)",
    });
  }),
];

/*DELETE POST BY ID*/
module.exports.post_delete = asyncHandler(async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).exec();
    await post.deleteOne();
    res.json({
      message:
        "DELETE req of one singular post id. - now redirect to normal /posts get post page. | (Is protected)",
    });
  } catch (err) {
    res.status(404).json({ message: "Post was not found", err: err.message });
  }
});
