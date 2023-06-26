const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const postsController = require("../controllers/postsController");
/* GET posts. */
router.get("/", postsController.posts_get);
//postsController.create_get
router.get(
  "/new",
  passport.authenticate("jwt", { session: false }),
  postsController.create_get
);

router.post(
  "/new",
  passport.authenticate("jwt", { session: false }),
  postsController.create_post
); // POST new post

router.get("/:id", postsController.post_get); // READ an existing post
router.post("/:id", postsController.comment_post); // CREATE a new comment on an existing post
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  postsController.update_put
); // UPDATE an existing post - PUT and complete the update
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  postsController.post_delete
); // DELETE an existing post
router.get(
  "/:id/update",
  passport.authenticate("jwt", { session: false }),
  postsController.update_get
); // UPDATE an existing post - GET (a form)

module.exports = router;
