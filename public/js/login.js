const login = async (email, password) => {
  const request = await axios
    .post("/api/auth/login", {
      email,
      password,
    })
    .catch((error) => {
      alert(error.response.data.message);
    });

  Cookies.set("jwt", request.data.token);

  if (request.data) {
    if (request.data.status === "success") {
      alert("logged in");

      window.setTimeout(() => {
        location.assign("/selection");
      }, 0);
    }
  }
};

const submit = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  login(email, password);
};
