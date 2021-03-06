const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name !"],
  },
  email: {
    type: String,
    require: [true, "Please provide your email !"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email!"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password!"],
    validate: {
      validator: function (confirmPass) {
        return this.password === confirmPass;
      },
      message: "The password doesn't match!",
    },
  },
  role: {
    type: String,
    enum: ["poster", "admin"],
    default: "poster",
  },
  id: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
