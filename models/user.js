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

// THIS WAS A MONGOOSE PRE-HOOKS ATTEMPT 
// userSchema.pre("save", async (next) => {
//   const user = this;
//   const hash = await bcrypt.hash(this.password, 10);
//   this.password = hash;
//   console.log('calling prehook')
//   next();
// });
// userSchema.methods.isValidPassword = async function (password) {
//   const user = this;
//   const compare = await bcrypt.compare(password, user.password);
//   return compare;
// };

module.exports = mongoose.model("User", userSchema);
