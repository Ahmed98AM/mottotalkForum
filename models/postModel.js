const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A post must have a title"],
      trim: true,
    },
    lastUpdatedOn: {
      type: Date,
      default: Date.now(),
    },
    cover: {
      type: String,
      default: "default-post.jpg",
    },
    desc: {
      type: String,
    },
    poster: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Post must have an owner"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.pre("save", function (next) {
  this.lastUpdatedOn = Date.now();
  next();
});
postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});
postSchema.pre(/^find/, function (next) {
  this.sort({ lastUpdatedOn: -1 });
  next();
});
postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "poster",
    select: "name",
  });
  next();
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
