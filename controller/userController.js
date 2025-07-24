const randomstring = require("randomstring");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" }); // SETTING ENV VARIABLE

// CUSTOMER MODULES
const User = require("./../models/userModel");
//SHOW ALL CUSTOMER
exports.getAllUsers = async (req, res) => {
  try {
    let user = await User.find();

    res.status(200).json({
      status: "success",
      results: user.length,
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

//Get a User through ID
exports.getUserByID = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

//Updating a User through ID
exports.updateUserByID = async (req, res) => {
  try {
    const body = req.body;
    
    if (body.password) body.password = await bcrypt.hash(body.password, 12);

    const user = await User.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
    console.log(err);
  }
};

//Delete a User through ID
exports.deleteUserByID = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
