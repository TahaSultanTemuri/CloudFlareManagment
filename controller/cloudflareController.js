const randomstring = require("randomstring");
const dotenv = require("dotenv");
//const axios = require("axios");
const { default: Axios } = require("axios");

dotenv.config({ path: "./config.env" }); // SETTING ENV VARIABLE

// CUSTOMER MODULES
const Customer = require("../models/customerModel");
const mailService = require("../service/mailService");
const customerService = require("../service/customerService");

//const cloudFlareService =require("../service/cloudflare-api");

// API=https://api.cloudflare.com/client/v4/
// XAuthEmail=schedy80@gmail.com
// XAuthKey=bfa1f1d6a80ca25c62a5df71519b420175981
// ZONEID=c6564307112774e9cf4b745d7515bebc
// DOMAIN=ocdbiz.cloud

exports.createSubDomain = async (req, res) => {
  //https://developers.cloudflare.com/api/operations/dns-records-for-a-zone-create-dns-record

  let data = {
    content: process.env.DOMAIN,
    name: req?.body?.thirdLevelDomain,
    proxied: true,
    type: "CNAME",
    comment: "Domain verification record",
    ttl: 3600,
  };

  Axios.post(
    `${process.env.API}/zones/${process.env.ZONEID}/dns_records`,
    data,
    {
      headers: {
        "X-Auth-Email": process.env.XAuthEmail,
        "X-Auth-Key": process.env.XAuthKey,
      },
    }
  )
    .then((response) => {
      res.status(200).json({
        status: "success",
        response: response.data,
      });
    })
    .catch((error) => {
      const errorlist = error.response.data.errors;
      const errMsg = errorlist.map((err, index) => `${index + 1}. ${err.message}`);

      console.log(errMsg.join(', '))

      res.status(200).json({
        status: "fail",
        error: errMsg.join(', '),
      });
    });
};





exports.updateSubDomain = async (req, res) => {
  //https://developers.cloudflare.com/api/operations/dns-records-for-a-zone-create-dns-record

  let data = {
    content: process.env.DOMAIN,
    name: req?.body?.thirdLevelDomain,
    proxied: true,
    type: "CNAME",
    comment: "Domain verification record",
    ttl: 3600,
  };

  Axios.put(
    `${process.env.API}/zones/${process.env.ZONEID}/dns_records/${req?.body?.Id}`,
    data,
    {
      headers: {
        "X-Auth-Email": process.env.XAuthEmail,
        "X-Auth-Key": process.env.XAuthKey,
      },
    }
  )
    .then((response) => {
      res.status(200).json({
        status: "success",
        response: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
      const errorlist = error.response.data.errors;
      const errMsg = errorlist.map((err, index) => `${index + 1}. ${err.message}`);

      console.log(errMsg.join(', '))

      res.status(200).json({
        status: "fail",
        error: errMsg.join(', '),
      });
    });
};




exports.createPageRule = async (req, res) => {
  const domainVal = req?.body?.thirdLevelDomain+'.'+process.env.DOMAIN;
  let data = JSON.stringify({
    "actions": [
      {
        "id": "forwarding_url",
        "value": {
          "url": req?.body?.domainRedirect.trim(),
          "status_code": 301
        }
      }
    ],
    "priority": 1,
    "status": "active",
    "targets": [
      {
        "constraint": {
          "operator": "matches",
          "value": req?.body?.thirdLevelDomain.trim(),
        },
        "target": "url"
      }
    ]
  });

  
  Axios.post(
    `${process.env.API}/zones/${process.env.ZONEID}/pagerules`,
    data,
    {
      headers: {
        "X-Auth-Key": process.env.XAuthKey,
        'Content-Type': 'application/json',
        "X-Auth-Email": process.env.XAuthEmail,
      },
    }
  )
    .then((response) => {
      res.status(200).json({
        status: "success",
        response: response.data,
      });
    })
    .catch((error) => {
      const errorlist = error.response.data.errors;
      const errMsg = errorlist.map((err, index) => `${index + 1}. ${err.message}`);

      console.log(errMsg.join(', '))

      res.status(200).json({
        status: "fail",
        error: errMsg.join(', '),
      });
    });
};

























exports.removePageRule = async (req, res) => {
  

  let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url:  `${process.env.API}/zones/${process.env.ZONEID}/pagerules/${req?.params?.Id}`,
    headers: { 
      "X-Auth-Email": process.env.XAuthEmail,
      "X-Auth-Key": process.env.XAuthKey,
    }
  };
  
  Axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
    res.status(200).json({
      status: "success",
      response: response.data,
    });
  })
  .catch((error) => {
    const errorlist = error.response.data.errors;
    const errMsg = errorlist.map((err, index) => `${index + 1}. ${err.message}`);

    console.log(errMsg.join(', '))

    res.status(200).json({
      status: "fail",
      error: errMsg.join(', '),
    });
  });
  
};


exports.updatePageRule = async (req, res) => {
  const domainVal = req?.body?.thirdLevelDomain+'.'+process.env.DOMAIN;
  let data = JSON.stringify({
    "actions": [
      {
        "id": "forwarding_url",
        "value": {
          "url": req?.body?.domainRedirect.trim(),
          "status_code": 301
        }
      }
    ],
    "priority": 1,
    "status": "active",
    "targets": [
      {
        "constraint": {
          "operator": "matches",
          "value": req?.body?.thirdLevelDomain.trim(),
        },
        "target": "url"
      }
    ]
  });

  
  Axios.put(
    `${process.env.API}/zones/${process.env.ZONEID}/pagerules/${req?.body?.Id}`,
    data,
    {
      headers: {
        "X-Auth-Key": process.env.XAuthKey,
        'Content-Type': 'application/json',
        "X-Auth-Email": process.env.XAuthEmail,
      },
    }
  )
    .then((response) => {
      res.status(200).json({
        status: "success",
        response: response.data,
      });
    })
    .catch((error) => {
      const errorlist = error.response.data.errors;
      const errMsg = errorlist.map((err, index) => `${index + 1}. ${err.message}`);

      console.log(errMsg.join(', '))

      res.status(200).json({
        status: "fail",
        error: errMsg.join(', '),
      });
    });
};










exports.removeSubDomain = async (req, res) => {
  //https://developers.cloudflare.com/api/operations/dns-records-for-a-zone-create-dns-record

 console.log("remove dns");
 console.log(req.params);
let config = {
  method: 'delete',
  maxBodyLength: Infinity,
  url: `${process.env.API}/zones/${process.env.ZONEID}/dns_records/${req?.params?.Id}`,
  headers: { 
    "X-Auth-Email": process.env.XAuthEmail,
      "X-Auth-Key": process.env.XAuthKey,
  }
};

Axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  res.status(200).json({
    status: "success",
    response: response.data,
  });
})
.catch((error) => {
  const errorlist = error.response.data.errors;
  const errMsg = errorlist.map((err, index) => `${index + 1}. ${err.message}`);

  console.log(errMsg.join(', '))

  res.status(200).json({
    status: "fail",
    error: errMsg.join(', '),
  });
});
};





exports.getSubDomains = async (req, res) => {
  //https://developers.cloudflare.com/api/operations/dns-records-for-a-zone-create-dns-record

  let data = '';

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url:  `${process.env.API}/zones/${process.env.ZONEID}/dns_records`,
    headers: { 
      "X-Auth-Email": process.env.XAuthEmail,
      "X-Auth-Key": process.env.XAuthKey,
    },
    data : data
  };
  
  Axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
    res.status(200).json({
      status: "success",
      response: response.data,
    });
  })
  .catch((error) => {
    const errorlist = error.response.data.errors;
      const errMsg = errorlist.map((err, index) => `${index + 1}. ${err.message}`);

      console.log(errMsg.join(', '))

      res.status(200).json({
        status: "fail",
        error: errMsg.join(', '),
      });
  });
  
};
















exports.getPageRules = async (req, res) => {
  //https://developers.cloudflare.com/api/operations/dns-records-for-a-zone-create-dns-record

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.API}/zones/${process.env.ZONEID}/pagerules`,
    headers: { 
      "X-Auth-Email": process.env.XAuthEmail,
      "X-Auth-Key": process.env.XAuthKey,
    }
  };
  
  Axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
    res.status(200).json({
      status: "success",
      response: response.data,
    });
  })
  .catch((error) => {
    const errorlist = error.response.data.errors;
    const errMsg = errorlist.map((err, index) => `${index + 1}. ${err.message}`);

    console.log(errMsg.join(', '))

    res.status(200).json({
      status: "fail",
      error: errMsg.join(', '),
    });
  });


 

};