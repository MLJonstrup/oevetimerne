function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const user = {
    username,
    password,
  };

  axios
    .post("http://161.35.86.140/customer/login", user)
    .then(function (response) {
      location.href = "http://161.35.86.140/chat";
    })
    .catch(function (error) {
      console.log(error);
    });
}