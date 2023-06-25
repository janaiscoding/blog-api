const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const postSchema = new Schema(
  {
    title: { type: String, required: true, minLength: 3 },
    text: { type: String, required: true, minLength: 3 },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
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
