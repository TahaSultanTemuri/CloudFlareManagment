const randomstring = require("randomstring");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" }); // SETTING ENV VARIABLE

// CUSTOMER MODULES
const Customer = require("./../models/customerModel");
const mailService = require("../service/mailService");
const customerService = require("../service/customerService");

//const cloudFlareService =require("../service/cloudflare-api");



// API=https://api.cloudflare.com/client/v4/
// XAuthEmail=schedy80@gmail.com
// XAuthKey=bfa1f1d6a80ca25c62a5df71519b420175981
// ZONEID=c6564307112774e9cf4b745d7515bebc
// DOMAIN=ocdbiz.cloud



//SHOW ALL CUSTOMER
exports.getAllCustomers = async (req, res) => {
  try {

    debugger;
    console.log("list");
    let customer =await customerService.fetchCustomer();

    res.status(200).json({
      status: "success",
      results: customer.length,
      data: {
        customer,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

//creating NewCustomer controller
exports.createNewCustomer = async (req, res) => {
  try {
    const password = randomstring.generate({
      length: 12,
      charset: "alphabetic",
    });

    const reqBody = {
      name: req?.body?.name,
      email: req?.body?.email,
      aemail: req?.body?.aemail,

      thirdLevelDomain: req?.body?.thirdLevelDomain,
      domainRedirect: req?.body?.domainRedirect,
      address: req?.body?.address,
      phone: req?.body?.phone,
      password,
    };

    

    const newCustomer = await Customer.create(reqBody); // creating an object from data sent in req.body

    const from = process.env.SMTP_FROM_EMAIL;

    const sent = mailService.throughMail(
      from,
      reqBody.email,
      "Your credentials have been created successfully for .....",
      "text",
      `here are your credentials, email: ${reqBody.email}, password: ${reqBody.password}`
    );

    res.status(201).json({
      status: "success",
      data: {
        Customer: newCustomer,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

//Get a Customer through ID
exports.getCustomerByID = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        customer,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

//Updating a Customer through ID
exports.updateCustomerByID = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        customer,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

//Delete a Customer through ID
exports.deleteCustomerByID = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);

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




exports.createSubDomain= async (req,res)=>{
  //https://developers.cloudflare.com/api/operations/dns-records-for-a-zone-create-dns-record
      const axios = require('axios');
      let data = JSON.stringify({
        "content": process.env.DOMAIN,
        "name": req.params.thirdLevelDomain,
        "proxied": true,
        "type": "CNAME",
        "comment": "Domain verification record",
        "ttl": 3600
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.API}/zones/${process.env.ZONEID}/dns_records`,
        headers: { 
          'X-Auth-Email':process.env.XAuthEmail, 
          'X-Auth-Key':process.env.XAuthKey, 
          'Content-Type': 'application/json', 
          'Cookie': '__cflb=0H28vgHxwvgAQtjUGUSTLLCMLmdTy1vPsQK69hwTwD7; __cfruid=e89872e81fccb63049af7e772e1fea94b08415dc-1691777808'
        },
        data : data
      };
      
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
      
  
  }