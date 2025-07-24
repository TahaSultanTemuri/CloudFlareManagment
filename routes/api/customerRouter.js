const express = require('express');
const controller = require('../../controller/customerController');

const router = express.Router();

// ROUTES
router
  .route('/')
  .get(controller.getAllCustomers)
  .post(controller.createNewCustomer)

  
router
  .route('/:id')
  .get(controller.getCustomerByID)
  .patch(controller.updateCustomerByID)
  .delete(controller.deleteCustomerByID);


  

  
  
 


module.exports = router;