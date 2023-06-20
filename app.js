const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const jwtStrategy = require("./strategies/jwt");
const jwt = require("jsonwebtoken");

// DATABASE
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URL;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const authRouter = require("./routes/authRoutes");

// const postRouter = require("./routes/posts");

const app = express();
passport.use(jwtStrategy);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRouter);
app.get("/success", (req, res) => {
  res.send("this was success");
});
app.get("/failure", (req, res) => {
  console.log(req.body)
  res.send("this was failure");
});
app.get(
  "/posts",
  passport.authenticate(
    "jwt",
    {
      successRedirect: "/success",
      failureRedirect: "/failure",
    },
  ),
  (req, res) => {
    console.log("body", req.body);
    return res.send("protected route");
  }
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
