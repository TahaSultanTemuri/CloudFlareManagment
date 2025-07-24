


const register = async (newUser) => {


  
  
  const request = await axios
    .post("/api/auth/signup", newUser)
    .catch((error) => {
      alert(error.response.data.message);
    });

  if (request.data) {
    if (request.data.status === "success") {
      alert("New User Added Successfully");
    }

    if (request.data.status === "fail") {
      alert(request?.data?.message);
    }
  }
};

const submit = async () => {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;

  const newUser = {
    username,
    email,
    password,
    passwordConfirm,
  };

  register(newUser);
};
