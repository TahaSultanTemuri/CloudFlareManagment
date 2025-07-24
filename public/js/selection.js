const submit = async () => {
  debugger;

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const aemail = document.getElementById("aemail").value;

  const thirdLevelDomain = document.getElementById("thirdLevelDomain").value;
  const domainRedirect = document.getElementById("domainRedirect").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;

  debugger;

  const data = {
    name,
    email,
    aemail,
    thirdLevelDomain,
    domainRedirect,
    address,
    phone,
  };
  const redirectData = {
    thirdLevelDomain,
    domainRedirect,
  };
redirectData.thirdLevelDomain=  `${redirectData.thirdLevelDomain}.ocdbiz.cloud`;


console.log(redirectData);


  try {
    const subdomain = await axios.post(`/api/cloudflare`, data);
   

    if (subdomain.data.status === "fail") {
      alert(subdomain.data.error);
      return; 
    }

    const redirect = await axios.post(`/api/cloudflare/pagerule`, redirectData);

    if(redirect.data.status === "fail"){
      alert(subdomain.data.error);
      return; 
    }

    const res = await axios.post("/api/customer", data);

    if (res?.data?.status === "success") {
      alert("New Customer Added");
      window.setTimeout(() => {
        location.assign("/selection");
      }, 0);
    }
  } catch (error) {
    alert(error);
  }
};

const logout = async () => {
  try {
    await axios.get("/api/auth/logout");

    window.setTimeout(() => {
      location.assign("/");
    }, 0);
  } catch (error) {
    alert(error);
  }
};

function getById(customerId) {
  debugger;
  axios
    .get("/api/customer/" + customerId)
    .then((response) => {
      const data = response.data;
      debugger;
      document.querySelector("#edit-name").value = data.data.customer.name;
      document.querySelector("#edit-email").value = data.data.customer.email;
      document.querySelector("#edit-aemail").value = data.data.customer.aemail;

      document.querySelector("#edit-thirdLevelDomain").value =
        data.data.customer.thirdLevelDomain;
      document.querySelector("#edit-domainRedirect").value =
        data.data.customer.domainRedirect;
      document.querySelector("#edit-address").value =
        data.data.customer.address;
      document.querySelector("#edit-phone").value = data.data.customer.phone;
      document.querySelector("#edit-customer-id").value =
        data.data.customer._id; // Set the customer ID
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle the error
    });
}
const deleteById = async (customerId) => {

  try {
    debugger;
    const customer = await axios.get("/api/customer/" + customerId);
  

    const getdomains = await axios.get(`/api/cloudflare/getSubDomains`,null);
  

    if(getdomains.data.status === "success"){
      const domain = `${customer?.data?.data?.customer?.thirdLevelDomain}.ocdbiz.cloud`;
      var obj =  getdomains?.data?.response?.result?.filter(a=>a.name==domain);
 if(obj.length>0){

   Id =  obj[0].id;
if(Id){


const remdomains = await axios.delete(`/api/cloudflare/removeSubdomain/${Id}`);
debugger
if(remdomains.data.status === "success"){


  alert("Domain Deleted!");


//page rule remove


const getpagerule = await axios.get(`/api/cloudflare/getPageRules`,null);

  
  if (getpagerule.data.status === "fail") {
    alert('Page rule not found');
    console.log(getpagerule.data);

   // return; 
  }

  if (getpagerule.data.status === "success") {
    
    console.log(getpagerule.data);


    let rule = getpagerule?.data?.response?.result?.filter(a=>a.targets[0].constraint.value.trim().replaceAll('/','')==`${customer?.data?.data?.customer.thirdLevelDomain}.ocdbiz.cloud`);
    if(rule.length>0){
      const pageruleremove = await axios.delete(`/api/cloudflare/removePageRule/${rule[0].id}`);
      debugger
        if(pageruleremove.data.status === "success"){
      
      
      alert("Page Rule Removed");
      
        }
      
    }
      


   // return; 
  }






const custremove = await axios.delete("/api/customer/" + customerId);

if (custremove?.status === 200){

alert("Customer Removed");

window.setTimeout(() => {
  location.assign("/selection");
}, 0);
}


}

}


 }
 else{

    alert("Domain not found");
  
 }
   
    }
    else{

      alert("Unable to fetch domain list");
    }



  
  } catch (error) {
    alert(error);
  }
};

const submitUpdate = async () => {
  const name = document.getElementById("edit-name").value;
  const email = document.getElementById("edit-email").value;
  const aemail = document.getElementById("edit-aemail").value;

  const thirdLevelDomain = document.getElementById(
    "edit-thirdLevelDomain"
  ).value;
  const domainRedirect = document.getElementById("edit-domainRedirect").value;
  const address = document.getElementById("edit-address").value;
  const phone = document.getElementById("edit-phone").value;
  const password = document.getElementById("edit-password").value;
  const customerId = document.getElementById("edit-customer-id").value;
  const customerData = {
    name,
    email,
    aemail,
    thirdLevelDomain,
    domainRedirect,
  };
  if (address) customerData.address = address;
  if (phone) customerData.phone = phone;
  const userData = {
    username: name,
    email,
  };
  if (password) userData.password = password;
  try {
   // const redirect = await axios.post(`/api/cloudflare/pagerule`, data);
    //debugger;
    const customer = await axios.get("/api/customer/" + customerId);
    let res;
    res = await axios.patch(
      "/api/user/" + customer?.data?.data?.customer?.userID,
      userData
    );
    res = await axios.patch("/api/customer/" + customerId, customerData);

    if (res?.data?.status === "success") {
      alert("Customer Updated");
      window.setTimeout(() => {
        location.assign("/selection");
      }, 0);
    }
  } catch (error) {
    alert(error);
  }
};


const submitUpdateAdmin = async () => {
  const name = document.getElementById("edit-name").value;
  const email = document.getElementById("edit-email").value;
  const aemail = document.getElementById("edit-aemail").value;

  const thirdLevelDomain = document.getElementById(
    "edit-thirdLevelDomain"
  ).value;
  const domainRedirect = document.getElementById("edit-domainRedirect").value;
  const address = document.getElementById("edit-address").value;
  const phone = document.getElementById("edit-phone").value;
  const customerId = document.getElementById("edit-customer-id").value;
  const customerData = {
    name,
    email,
    aemail,
    thirdLevelDomain,
    domainRedirect,
  };
  const updatedomain = {
    name,
    email,
    aemail,
    thirdLevelDomain,
    domainRedirect,
    address,
    phone,
    Id:''
  };
  if (address) customerData.address = address;
  if (phone) customerData.phone = phone;
  const randomPassword = generateRandomPassword();
  const userData = {
    username: name,
    email,
    password: randomPassword,
  };
  try {
    console.log(randomPassword);
    const customer = await axios.get("/api/customer/" + customerId);


    const getdomains = await axios.get(`/api/cloudflare/getSubDomains`,null);
   

    debugger
          if(getdomains.data.status === "success"){
            const domain = `${customer?.data?.data?.customer?.thirdLevelDomain}.ocdbiz.cloud`;
            var obj =  getdomains?.data?.response?.result?.filter(a=>a.name==`${customer?.data?.data?.customer?.thirdLevelDomain}.ocdbiz.cloud`);
       if(obj.length>0){
    
         Id =  obj[0].id;
    if(Id){

      updatedomain.Id=Id;

      }
    }
    else{
      alert("Domain not found or just removed");
      return;
    }

    }

    const subdomainupdate = await axios.put(`/api/cloudflare/updateSubDomain`, updatedomain);
   

    if (subdomainupdate.data.status === "fail") {
      alert('Domain update failed');
      console.log(subdomainupdate.data);

      return; 
    }



    const getpagerule = await axios.get(`/api/cloudflare/getPageRules`,null);

    
    if (getpagerule.data.status === "fail") {
      alert('Page rule not found');
      console.log(getpagerule.data);

      return; 
    }


    let rule = getpagerule?.data?.response?.result?.filter(a=>a.targets[0].constraint.value.trim().replaceAll('/','')==`${customer?.data?.data?.customer.thirdLevelDomain}.ocdbiz.cloud`);
if(rule.length>0){


  const redirectData = {
    thirdLevelDomain,
    domainRedirect,
    Id:rule[0].id
  };
redirectData.thirdLevelDomain=  `${redirectData.thirdLevelDomain}.ocdbiz.cloud`;


console.log(redirectData);

  const pagerule = await axios.put(`/api/cloudflare/updatePageRule`, redirectData);

    if(pagerule.data.status === "fail"){
      alert('Redirect rule update error');

      console.log(pagerule.data);
      return; 
    }


}




    let res;
    // res = await axios.patch(
    //   "/api/user/" + customer?.data?.data?.customer?.userID,
    //   userData
    // );
    res = await axios.patch("/api/customer/" + customerId, customerData);
    // res = await axios("/api/customer/" + customerId, customerData);
    res = await axios.post("/api/mail", {
      from: "hdaudy2@gmail.com",
      to: email,
      subject: "Profile have been updated",
      type: "text",
      value: `Your Profile is Updated from user Admin and Your Updated Credentials are ${email} and ${randomPassword}`,
    });

    if (res?.data?.status === "success") {
      alert("Customer Updated");
      window.setTimeout(() => {
        location.assign("/selection");
      }, 0);
    }
  } catch (error) {
    alert(error);
  }
};

// Function to generate a random password
const generateRandomPassword = () => {
  // Define the set of characters to choose from
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const passwordLength = 12; // Set the desired password length

  // Generate the password
  let password = "";
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
};

