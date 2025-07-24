// MODULES
const mongoose = require("mongoose");
const User = require("./userModel");

// CREATE CUSTOMER SCHEMA
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name of Customer is required."],
  },
  email: {
    type: String,
    required: [true, "Email of Customer is required."],
    unique: true,
  },
  aemail: {
    type: String,
    unique: false,
  }, 
  thirdLevelDomain: String,
  domainRedirect: String,
  password: String,
  address: String,
  phone: String,
  userID: {
    type: mongoose.Schema.ObjectId,
  },
});

customerSchema.pre("save", async function (next) {
  try {
    const user = {
      username: this.name,
      email: this.email,
      aemail: this.aemail,
      role: "Customer",
      password: this.password,
      passwordConfirm: this.password,
      customerID: this._id
    };

    const newUser = await User.create(user);
    this.password = undefined;
    this.userID = newUser._id;
    next();
  } catch (error) {
    next(error);
  }
});

customerSchema.pre(/^find/, function (next) {
  this.populate({
    path: "data",
    select: "-__v",
  });

  next();
});

// CREATE A MONGOOSE MODEL USING tHIS SCHEMA
const Customer = mongoose.model("Customer", customerSchema);

// EXPORTING THE MODULE
module.exports = Customer;
