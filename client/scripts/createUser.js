document.addEventListener('DOMContentLoaded', () => {

  async function createUser() {

    let newUser = {
      username: "",
      firstname: "",
      lastname: "",
      phone: "",
      email: "",
      password: "",
      verified: false
    };

    newUser.username = document.getElementById("newUsername").value;
    newUser.firstname = document.getElementById("newFirstName").value;
    newUser.lastname = document.getElementById("newLastName").value;
    newUser.phone = document.getElementById("newPhoneNumber").value;
    newUser.email = document.getElementById("newEmail").value;
    newUser.password = document.getElementById("newPassword").value;
    newUser.verified = false;

    try {
      const response = await fetch('/user/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        console.log('User created successfully!');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  document.getElementById("createUserButton").addEventListener("click", createUser);

  // You can add an event listener here if needed
  // For example, if this is in response to a button click:
  // document.getElementById("createUserButton").addEventListener("click", createUser);
});
  
    /*const mailOptions = {
      from: 'joejuicecbs@gmail.com',
      to: email,
      subject: 'User Registration Confirmation',
      text: `Hello ${username},\n\nThank you for registering on our platform! Your account has been created successfully.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Error sending confirmation email');
      }
   
      console.log('Email sent: ' + info.response);
    });

    const accountSid = 'AC2568c266f5a66782edf7eaa92c6d8ba7';
    const authToken = '81050ce433ea5cf7183a968b0b8a5c3a';
    const client = require('twilio')(accountSid, authToken);

    client.messages
        .create({
            body: 'Hello ${username},\n\nThank you for registering on our platform! Your account has been created successfully.',
            from: '+14692084452',
            to: '${phone}'
        })
        .then(message => console.log(message.sid))
        .done();
  } else {
    console.error('Error creating user:', response.status);
  }
} catch (error) {
  console.error('An error occurred:', error);
}
});


  /*const nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "joejuicecbs@gmail.com",
      pass: "shadiborpaanoerrebro",
    },
  });


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
        const response = await fetch('/user/createUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),

        });
        if (response.ok) {
          console.log('User created successfully!');

          /*const mailOptions = {
            from: 'joejuicecbs@gmail.com',
            to: email,
            subject: 'User Registration Confirmation',
            text: `Hello ${username},\n\nThank you for registering on our platform! Your account has been created successfully.`
          };
      
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error(error);
              return res.status(500).send('Error sending confirmation email');
            }
         
            console.log('Email sent: ' + info.response);
          });

          const accountSid = 'AC2568c266f5a66782edf7eaa92c6d8ba7';
          const authToken = '81050ce433ea5cf7183a968b0b8a5c3a';
          const client = require('twilio')(accountSid, authToken);

          client.messages
              .create({
                  body: 'Hello ${username},\n\nThank you for registering on our platform! Your account has been created successfully.',
                  from: '+14692084452',
                  to: '${phone}'
              })
              .then(message => console.log(message.sid))
              .done();
        } else {
          console.error('Error creating user:', response.status);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }*/