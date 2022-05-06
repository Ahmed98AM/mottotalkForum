const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Comment can't be empty !"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    liked: {
      type: Boolean,
      default: true,
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "Comment must belong to a post "],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Comment must have an owner"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "post",
    select: "_id",
  });
  next();
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
