const express = require('express');
const viewController = require('../controller/viewController');
const authController = require('../controller/authController');

const router = express.Router();

router.route('/selection').get(authController.protect, viewController.getSelection);
router.route('/register').get(authController.protect, viewController.getRegister);
router.route('/').get(viewController.getLogin);

module.exports = router;