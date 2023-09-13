let responseDom = document.getElementById("response");

function getUsers() {
  axios
    .get("http://localhost:3000/customer")
    .then(function (response) {
      // handle success
      console.log(response.data);
      responseDOM.innerHTML = "All users available in console";
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
}

function saveUser() {}

function saveImage() {}
