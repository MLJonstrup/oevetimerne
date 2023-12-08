document.addEventListener('DOMContentLoaded', () => {
    const createform = document.getElementById('createUserForm');
    const userId = 12; //USE COOKIE LATER
    let newUser = {
      userID: "",
      username: "",
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      password: "",
      verified: false
    };
  
    // Add event listener for form submission
    createform.addEventListener('submit', async (event) => {
      event.preventDefault();
      newUser.userID = userId;
      newUser.username = document.getElementById("newUsername").value;
      newUser.firstname = document.getElementById("newFirstName").value;
      newUser.lastname = document.getElementById("newLastName").value;
      newUser.phone = document.getElementById("newPhoneNumber").value;
      newUser.email = document.getElementById("newEmail").value;
      newUser.verified = false

      try {
        const response = await fetch('/post/createUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });
        if (response.ok) {
          console.log('User created successfully!');
        } else {
          console.error('Error creating user:', response.status);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    });
  });