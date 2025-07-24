const { fetchCustomer, fetchCustomerByID } = require("../service/customerService");

exports.getRegister = (req, res, next) => res.status(200).render("register");
exports.getLogin = (req, res, next) => res.status(200).render("login");
exports.getSelection = async (req, res, next) => {
  const user = req.user;
  const data = {user}

  if (user.role === "Admin") {
    const customerList = await fetchCustomer();
    data.customerList = customerList;
  }
  if(user.role === 'Customer'){
    const customer = await fetchCustomerByID(user.customerID);
    console.log(user.customerID);
    data.customer = customer;
  }
  
  res.status(200).render("selection", data);
};
