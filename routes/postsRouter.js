const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const postsController = require("../controllers/postsController");
/* GET - Read all the existing posts. */
router.get("/", postsController.posts_get);

/* POST - Create a new post. */
router.post(
  "/new",
  passport.authenticate("jwt", { session: false }),
  postsController.create_post
);

/* GET - Read existing posts/:id. */
router.get("/:id", postsController.post_get);

/* POST - Create a new post comment. */
router.post("/:id", postsController.comment_post);

/* PUT -  Update an existing post. */
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  postsController.update_put
);

/* DELETE -  Delete an existing post. */
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  postsController.post_delete
);

module.exports = router;
