"use strict";

var _require = require("../service/customerService"),
    fetchCustomer = _require.fetchCustomer;

exports.getRegister = function (req, res, next) {
  return res.status(200).render("register");
};

exports.getLogin = function (req, res, next) {
  return res.status(200).render("login");
};

exports.getSelection = function _callee(req, res, next) {
  var user, customerList;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user = req.user;
          customerList = [];

          if (!(user.role === "admin")) {
            _context.next = 6;
            break;
          }

          _context.next = 5;
          return regeneratorRuntime.awrap(fetchCustomer());

        case 5:
          customerList = _context.sent;

        case 6:
          res.status(200).render("selection", {
            user: user,
            customerList: customerList
          });

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
};