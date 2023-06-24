const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    author: "JanaIsCoding",
    published: Boolean,
  },
  { timestamps: true }
);

postSchema.virtual("time").get(function () {
  return `${DateTime.fromJSDate(this.createdAt).toLocaleString(
    DateTime.DATETIME_MED_WITH_SECONDS
  )}`;
});

module.exports = mongoose.model("Post", postSchema);
