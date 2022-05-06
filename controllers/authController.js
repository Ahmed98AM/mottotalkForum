const User = require("../models/userModel");
const { promisify } = require("util");
const JWT = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = function (id) {
  return JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_DURATION,
  });
};
const createSendToken = function (user, statusCode, res) {
  user.password = undefined;

  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
  return token;
};

exports.signUp = catchAsync(async function (req, res, next) {
  const role = req.body.role.toLowerCase();
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role,
  });
  createSendToken(newUser, 201, res);
});
exports.login = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("email or password is missing !"), 400);
  }

  const foundUser = await User.findOne({ email }).select("+password");
  if (
    !foundUser ||
    !(await foundUser.correctPassword(password, foundUser.password))
  ) {
    return next(new AppError("incorrect email or password !"), 401);
  }
  await foundUser.save({ validateBeforeSave: false });

  createSendToken(foundUser, 201, res);
});
exports.protect = catchAsync(async function (req, res, next) {
  //// getting token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.jwt !== "nothingToken") {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError("you are not logged in.. please login to get access !"),
      401
    );
  }

  //// verifying the token and decrypting it to get the included data (the user id)
  let decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user associated with this token does no longer exist !"
      ),
      401
    );
  }

  //// grant access to protected data
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});
exports.isLoggedIn = catchAsync(async function (req, res, next) {
  if (req.cookies) {
    try {
      const token = req.cookies.jwt;
      let decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
});
exports.logout = function (req, res, next) {
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  };
  res.cookie("jwt", "nothingToken", cookieOptions);
  res.status(200).json({ status: "success" });
};
exports.restricTo = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action !", 403)
      );
    }
    next();
  };
};
