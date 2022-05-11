const Post = require("../models/postModel");
const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.showMainPage = (req, res) => {
  res.status(200).render("mainPage", {
    title: "Mottotalk",
  });
};
exports.showSignupForm = catchAsync(async (req, res, next) => {
  res.status(200).render("signup", {
    title: "Sign Up",
  });
});
exports.showLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
});
exports.showNewPostForm = catchAsync(async (req, res, next) => {
  res.status(200).render("newPost", {
    title: "Add Post",
  });
});
exports.showEditPostForm = catchAsync(async (req, res, next) => {
  try {
    const foundPost = await Post.findById(req.params.id);
    res.status(200).render("editPost", {
      title: "Edit Post",
      post: foundPost,
    });
  } catch (err) {
    console.log(err);
  }
});
exports.showNewCommentForm = catchAsync(async (req, res, next) => {
  res.status(200).render("newComment", {
    title: "Submit Comment",
    postId: req.params.postId,
  });
});
exports.getAllPosts = catchAsync(async (req, res, next) => {
  const allUsers = await User.find();
  const allPosts = await Post.find();
  const posts = await Post.find();
  res.status(200).render("posts", {
    title: "Posts",
    numOfUsers: allUsers.length,
    numOfPosts: allPosts.length,
    posts,
  });
});
exports.getMePosts = catchAsync(async (req, res, next) => {
  const allUsers = await User.find();
  const allPosts = await Post.find();
  let idFilter = {};
  if (req.user && req.user.role === "poster") {
    idFilter = { poster: req.user._id.toString() };
  }
  const posts = await Post.find(idFilter);
  res.status(200).render("posts", {
    title: "Posts",
    numOfUsers: allUsers.length,
    numOfPosts: allPosts.length,
    posts,
  });
});
exports.getPost = catchAsync(async (req, res, next) => {
  let post = await Post.findById(req.params.id).populate({
    path: "comments",
    select: "comment liked user createdAt _id post  ",
  });
  let likeCounter = 0;
  let disLikeCounter = 0;
  for (comment of post.comments) {
    if (comment.liked) {
      likeCounter++;
    } else if (!comment.liked) {
      disLikeCounter++;
    }
  }
  if (!post) {
    return next(new AppError("no Post found with that id !", 404));
  }
  res.status(200).render("post", {
    title: `${post.title}`,
    post,
    likeCounter,
    disLikeCounter,
  });
});
exports.editPost = catchAsync(async (req, res, next) => {
  let post = await Post.findById(req.params.id).populate({
    path: "comments",
    select: "comment user createdAt _id post  ",
  });
  if (!post) {
    return next(new AppError("no Post found with that id !", 404));
  }
  res.status(200).render("post", {
    title: `${post.title}`,
    post,
  });
});
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).render("users", {
    title: "Users",
    users,
  });
});
