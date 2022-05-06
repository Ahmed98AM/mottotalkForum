const Post = require("./../models/postModel");
const factory = require("./handlerFunctionsFactory");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const multer = require("multer");
const sharp = require("sharp");
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadPostCover = upload.single("cover");
exports.resizePostCover = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(1920, 1080)
    .toFormat("jpeg")
    .jpeg({ quality: 100 })
    .toFile(`public/img/${req.file.filename}`);

  next();
});

exports.getAllPosts = factory.getAll(Post);
exports.getPost = factory.getOne(Post, {
  path: "comments",
  select: "comment user createdAt -post _id ",
});
exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);
