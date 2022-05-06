const Comment = require("./../models/commentModel");
const Post = require("../models/postModel");
const factory = require("./handlerFunctionsFactory");
const catchAsync = require("./../utils/catchAsync");

exports.setCommentIds = (req, res, next) => {
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
exports.getAllComments = factory.getAll(Comment);
exports.getComment = factory.getOne(Comment);
exports.createComment = catchAsync(async (req, res, next) => {
  await Post.findByIdAndUpdate(req.body.post, {
    lastUpdatedOn: Date.now(),
  });
  const doc = await Comment.create(req.body);
  res.status(201).json({ status: "success", data: { doc } });
});
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
