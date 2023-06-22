const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    //yoinked the token from postman header's authorization field - manually added
    next();
  } else {
    res.json({ message: "not authorized or forbidden" });
  }
};
const postsController = require("../controllers/postsController");
/* GET posts. */
router.get("/", postsController.posts_get);

//My Protected Routes
router.get("/new", verifyToken, postsController.new_post_get);
router.post("/new", verifyToken, postsController.new_post_post);

router.get("/:id", postsController.singular_post_get); // READ
router.post("/:id", postsController.singular_post_comment_post); // CREATE
// router.delete("/:id", postsController.singular_post_delete); // DELETE
// router.update("/:id", postsController.singular_post_update); // UPDATE

module.exports = router;
