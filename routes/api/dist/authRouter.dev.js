"use strict";

var express = require("express");

var authController = require("../../controller/authController");

var router = express.Router();
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);
module.exports = router;