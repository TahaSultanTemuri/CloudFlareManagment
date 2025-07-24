const Customer = require("../models/customerModel");

exports.fetchCustomer = async () => await Customer.find();
exports.fetchCustomerByID = async (ID) => await Customer.findById(ID);