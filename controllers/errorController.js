const AppError = require("./../utils/appError");

const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate of ${value}. Please again!`;
  return new AppError(message, 400);
};

const sendError = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.message.includes("validation")) {
      const validationErrsArr = err.message.split(",");
      const firstValidErr = validationErrsArr[0];
      err.message =
        firstValidErr.slice(firstValidErr.lastIndexOf(":") + 1, -1) +
        firstValidErr.slice(-1);
    }
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
      });
    }
  } else {
    res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (err.code === 11000) err = handleDuplicateFieldsDB(err);
  sendError(err, req, res);
};
