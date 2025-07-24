// MODULES
const express = require('express');

// USER MODULES
const DataController = require('../../controller/mailController');

// MAIL ROUTER
const router = express.Router();

// ROUTES

router.route('/').post(DataController.sendMail);

// EXPORTING
module.exports = router;