"use strict";

// MODULES
var mongoose = require("mongoose");

var User = require("./userModel"); // CREATE CUSTOMER SCHEMA


var customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name of Customer is required."]
  },
  email: {
    type: String,
    required: [true, "Email of Customer is required."],
    unique: true
  },
  thirdLevelDomain: String,
  domainRedirect: String,
  password: String
});
customerSchema.pre("save", function _callee(next) {
  var newUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          newUser = {
            username: this.name,
            email: this.email,
            role: "Customer",
            password: this.password,
            passwordConfirm: this.password
          };
          _context.next = 4;
          return regeneratorRuntime.awrap(User.create(newUser));

        case 4:
          this.password = undefined;
          next();
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          next(_context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, this, [[0, 8]]);
});
customerSchema.pre(/^find/, function (next) {
  this.populate({
    path: "data",
    select: "-__v"
  });
  next();
}); // CREATE A MONGOOSE MODEL USING tHIS SCHEMA

var Customer = mongoose.model("Customer", customerSchema); // EXPORTING THE MODULE

module.exports = Customer;