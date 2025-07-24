const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Customer"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Invalid email, Provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Provide a password"],
    minlength: 6,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Confirm your password"],
    validate: {
      // this will only work on SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: "Password not match.",
    },
  },
  customerID: {
    type: mongoose.Schema.ObjectId,
  },
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.hashPassword = async function (password) {
  return await bcrypt.hash(password, 12);
};

userSchema.pre("save", async function (next) {
  //   only run this when password was modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "data",
    select: "-__v",
  });

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
