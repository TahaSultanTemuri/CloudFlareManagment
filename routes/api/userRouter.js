const express = require('express');
const controller = require('../../controller/userController');

const router = express.Router();

// ROUTES
router
  .route('/')
  .get(controller.getAllUsers);

router
  .route('/:id')
  .get(controller.getUserByID)
  .patch(controller.updateUserByID)
  .delete(controller.deleteUserByID);


module.exports = router;