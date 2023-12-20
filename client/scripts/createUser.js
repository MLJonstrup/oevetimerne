document.addEventListener("DOMContentLoaded", () => {
  async function createUser() {
    let newUser = {
      username: "",
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      password: "",
      verified: false,
    };

    newUser.username = document.getElementById("newUsername").value;
    newUser.firstname = document.getElementById("newFirstName").value;
    newUser.lastname = document.getElementById("newLastName").value;
    newUser.phone = document.getElementById("newPhoneNumber").value;
    newUser.email = document.getElementById("newEmail").value;
    newUser.password = document.getElementById("newPassword").value;
    newUser.verified = false;

    try {
      const response = await fetch("/user/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert("Bruger er oprettet.");
        window.location.href = "https://joejuiceforum.social/";
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  document
    .getElementById("createUserButton")
    .addEventListener("click", createUser);
});

