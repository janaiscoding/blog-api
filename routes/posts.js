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
const postsController = require('../controllers/postsController')
/* GET posts. */
router.get("/", verifyToken, postsController.posts_get);

router.post("/", verifyToken, postsController.posts_post);

module.exports = router;
