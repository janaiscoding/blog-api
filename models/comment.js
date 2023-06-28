const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const commentSchema = new Schema(
  {
    comment: { type: String, required: true, minLength: 10, maxLength: 300 },
    name: { type: String, required: true, minLength: 2, maxLength: 24 },
  },
  { timestamps: true }
);

commentSchema.virtual("time").get(function () {
  return `${DateTime.fromJSDate(this.createdAt).toLocaleString(
    DateTime.DATETIME_MED_WITH_SECONDS
  )}`;
});

module.exports = mongoose.model("Comment", commentSchema);
