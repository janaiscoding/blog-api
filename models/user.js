const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  first_name: { type: String, required: true, minLength: 2, maxLength: 24 },
  last_name: { type: String, required: true, minLength: 2, maxLength: 24 },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minLength: 8 },
  author_status: Boolean,
});

module.exports = mongoose.model("User", userSchema);
