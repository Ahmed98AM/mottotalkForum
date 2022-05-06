const User = require("../models/userModel");
const Post = require("../models/postModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFunctionsFactory");

exports.getId = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};
exports.appStats = catchAsync(async (req, res, next) => {
  const allUsers = await User.find();
  const allPosts = await Post.find();
  res.status(201).json({
    status: "success",
    NumOfUsers: allUsers.length,
    NumOfPosts: allPosts.length,
  });
});
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
