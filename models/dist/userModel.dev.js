"use strict";

var mongoose = require("mongoose");

var validator = require("validator");

var bcrypt = require("bcryptjs");

userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    lowercase: true
  },
  role: {
    type: String,
    "enum": ["Admin", "Customer"]
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Invalid email, Provide a valid email"]
  },
  password: {
    type: String,
    required: [true, "Provide a password"],
    minlength: 6
  },
  passwordConfirm: {
    type: String,
    required: [true, "Confirm your password"],
    validate: {
      // this will only work on SAVE
      validator: function validator(el) {
        return el === this.password;
      },
      message: "Password not match."
    }
  }
});

userSchema.methods.correctPassword = function _callee(candidatePassword, userPassword) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(bcrypt.compare(candidatePassword, userPassword));

        case 2:
          return _context.abrupt("return", _context.sent);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

userSchema.pre("save", function _callee2(next) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (this.isModified("password")) {
            _context2.next = 2;
            break;
          }

          return _context2.abrupt("return", next());

        case 2:
          _context2.next = 4;
          return regeneratorRuntime.awrap(bcrypt.hash(this.password, 12));

        case 4:
          this.password = _context2.sent;
          this.passwordConfirm = undefined;
          next();

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
});
userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "data",
    select: "-__v"
  });
  next();
});
var User = mongoose.model("User", userSchema);
module.exports = User;