const axios = require('axios');

const API_TOKEN = 'Bearer ZRBcmmw0vxF5w-SS7PMxVaoVy4vCqVSuDSf1-HC5';
const ZONE_ID = '276ab55cdf02730f33620a1091f4c0ba'; // You can obtain this from Cloudflare dashboard

const API = 'https://api.cloudflare.com/client/v4/';

const XAuthEmail = 'abc@gmail.com';

const XAuthKey = 'bfa1f1d6a80ca25c62a5df71519b420175981';

const ZONEID =  'c6564307112774e9cf4b745d7515bebc';

const  DOMAIN ="ocdbiz.cloud";


async function getZoneIdentifierbydomain(){

    //https://community.cloudflare.com/t/cloudflare-zone-id/255417
    // const axios = require('axios');
 
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url:  `${API}/zones `,
  headers: { 
    'X-Auth-Email': XAuthEmail, 
    'X-Auth-Key': XAuthKey, 
    'Cookie': '__cflb=0H28vgHxwvgAQtjUGUSTLLCMLmdTy1vPzm6KJ8XkLFw; __cfruid=e89872e81fccb63049af7e772e1fea94b08415dc-1691777808'
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));

  if(response.result){

   var obj =  response.result.filter(a=>a.name==domain);
   if(obj.length>0){

    return response.result.filter(a=>a.name==domain)[0].id;
   }

  }

return -1;

  //write logic to pick c6564307112774e9cf4b745d7515bebc from response


})
.catch((error) => {
  console.log(error);
});

}


async function createSubDomain(subdomainname = "newhost"){
    //https://developers.cloudflare.com/api/operations/dns-records-for-a-zone-create-dns-record
        const axios = require('axios');
        let data = JSON.stringify({
          "content": DOMAIN,
          "name": subdomainname,
          "proxied": true,
          "type": "CNAME",
          "comment": "Domain verification record",
          "ttl": 3600
        });
        
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${API}/zones/${ZONEID}/dns_records`,
          headers: { 
            'X-Auth-Email': XAuthEmail, 
            'X-Auth-Key': XAuthKey, 
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
    



async function createPageRule(   from ="newhost.ocdbiz.cloud",  to="https://www.yahoo.com"){
const axios = require('axios');
let data = JSON.stringify({
  "actions": [
    {
      "id": "forwarding_url",
      "value": {
        "url": to,
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
        "value": `${from}.${DOMAIN}`
      },
      "target": "url"
    }
  ]
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `${API}/zones/${ZONEID}/pagerules`,
  headers: { 
    'X-Auth-Email': XAuthEmail, 
    'X-Auth-Key': XAuthKey, 
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



// Example usage
const userLinkedDomain = 'example.com';
const recordType = 'A';
const recordContent = '192.168.1.1'; // Replace with the appropriate IP or content

//exports.fetchZone = async () => await getZoneIdentifierbydomain;
exports.createSubDomain = async (subdomain) => await createSubDomain(subdomain);

exports.createRedirection = async (from,to) => await createPageRule(from,to);

//createSubDomain(userLinkedDomain, recordType, recordContent);
