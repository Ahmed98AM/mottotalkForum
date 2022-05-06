const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("no document found with that id !", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.file) req.body.cover = req.file.filename;
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError("no document found with that id !", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.file) req.body.cover = req.file.filename;
    const doc = await Model.create(req.body);
    res.status(201).json({ status: "success", data: { doc } });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let idFilter = {};
    // Check if the user is a poster user to filter only his posts .
    if (req.user && req.user.role === "poster") {
      idFilter = { poster: req.user._id.toString() };
    }
    const doc = await Model.find(idFilter);

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        doc,
      },
    });
  });
exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError("no document found with that id !", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });
