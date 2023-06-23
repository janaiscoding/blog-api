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
router.get("/new", verifyToken, postsController.create_get); // GET new form
router.post("/new", verifyToken, postsController.create_post); // POST new post

router.get("/:id", postsController.post_get); // READ an existing post
router.post("/:id", postsController.comment_post); // CREATE a new comment on an existing post
router.delete("/:id", postsController.post_delete); // DELETE an existing post

router.get('/:id/update',verifyToken, postsController.update_get) // UPDATE an existing post - GET (a form)
router.put('/:id/update', verifyToken, postsController.update_put) // UPDATE an existing post - PUT and complete the update


module.exports = router;
