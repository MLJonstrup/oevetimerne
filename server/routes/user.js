const express = require('express');
const path = require('path');
const router = express.Router();
//const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3').verbose();
const dbPath = './database.db';
const db = new sqlite3.Database(dbPath);
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "joejuicecbs@gmail.com",
    pass: "vwko ujkw ifla qqnm",
  },
});



router.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
  
      if (row) {
        res.cookie('userId', row.id, { httpOnly: true });
        console.log("Cookie set with userId:", row.id);

        res.status(200).send('Login successful!');
      } else {
        console.log("test2");
        // User not found or incorrect password, send an error response
        res.status(401).send('Invalid username or password');
      }
    });
  });

  router.get("/details", (req, res) => {
    const userId = req.cookies.userId;
  
    if (!userId) {
      return res.status(401).send('Unauthorized');
    }
  
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
  
      if (row) {
        res.status(200).json({
          userId: row.id,
          username: row.username,
          // Add other user details as needed
        });
      } else {
        res.status(404).send('User not found');
      }
    });
  });




  router.get('/createUser', (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/createUser.html"));
});
router.get('/deleteUser', (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/deleteUser.html"));
});


router.post('/createUser', async (req, res) => { 
    const { username, firstname, lastname, phone, email , password , verified } = req.body;  
    const query = `
    INSERT INTO users (username, firstname, lastname, phone, email , password , verified)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    db.run(
        query, 
        [username, firstname, lastname, phone, email , password , verified],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Error creating user' });
            } else {
                console.log(`User created successfully.`);
                res.status(200).json({ message: 'User created successfully!'});

                const mailOptions = {
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
                const authToken = '57ae2f8ff3bbb716b1669186bd257edc';
                const client = require('twilio')(accountSid, authToken);
                console.log(phone);
                client.messages
                    .create({
                        body: `Hello ${username},\n\nThank you for registering on our platform! Your account has been created successfully.`,
                        from: '+14692084452',
                        to: phone
                    })
                    .then(message => console.log(message.sid))
                    .finally(() => {
                      console.log("Message sent")
                    });
                

            }
        }
    );
});

router.post('/deleteUser', (req, res) => {
    const { username, password } = req.body;
  
    // Query the database to check if the username and password match
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
  
      if (row) {
        // User found, delete the user from the database
        db.run('DELETE FROM users WHERE username = ? AND password = ?', [username, password], function (err) {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }
  
          // Check if any row was affected (user was deleted)
          if (this.changes > 0) {
            // User deleted successfully, send a success response
            console.log("Bruger slettet");
            return res.status(200).send('User deleted successfully.');
     
          } else {
            // No rows affected, user not found or incorrect password
            return res.status(401).send('No rows affected');
          }
        });
      } else {
        // User not found or incorrect password, send an error response
        res.status(401).send('Invalid username or password');
      }
    });
  });


  module.exports = router; 