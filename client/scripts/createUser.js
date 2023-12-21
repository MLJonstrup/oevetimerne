//kode inspiretet fra følgene side: https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript

// Venter på at DOM'en er fuldt indlæst
document.addEventListener("DOMContentLoaded", () => {
  // Asynkron funktion til at oprette en ny bruger
  async function createUser() {
    // Definerer en ny bruger med tomme værdier og sætter verified til false
    let newUser = {
      username: "",
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      password: "",
      verified: false,
    };

    // Henter værdier fra formularfelter og opdaterer newUser objektet
    newUser.username = document.getElementById("newUsername").value;
    newUser.firstname = document.getElementById("newFirstName").value;
    newUser.lastname = document.getElementById("newLastName").value;
    newUser.phone = document.getElementById("newPhoneNumber").value;
    newUser.email = document.getElementById("newEmail").value;
    newUser.password = document.getElementById("newPassword").value;
    newUser.verified = false;

    try {
      // Sender en POST anmodning til serveren for at oprette en ny bruger
      const response = await fetch("/user/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      // Hvis anmodningen er vellykket, viser en besked og omdirigerer brugeren
      if (response.ok) {
        alert("Bruger er oprettet.");
        window.location.href = "https://joejuiceforum.social/";
      }
    } catch (error) {
      // Logger fejl, hvis der opstår en under anmodningen
      console.error("An error occurred:", error);
    }
  }
  
  // Tilføjer event listener til knappen for at oprette brugeren
  document
    .getElementById("createUserButton")
    .addEventListener("click", createUser);
});
