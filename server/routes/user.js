const express = require('express');
const path = require('path');
const router = express.Router();
//const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3').verbose();
const dbPath = './database.db';
const db = new sqlite3.Database(dbPath);
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "joejuicecbs@gmail.com",
    pass: "vwko ujkw ifla qqnm",
  },
});



router.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  // Fetch the user from the database
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
      }

      if (row) {
          // Compare the submitted password with the hashed password
          const match = await bcrypt.compare(password, row.password);

          if (match) {
              // Password matches, proceed with login
              res.cookie('userId', row.id, { httpOnly: true });
              console.log("Cookie set with userId:", row.id);
              res.status(200).send('Login successful!');
          } else {
              // Password does not match
              res.status(401).send('Invalid username or password');
          }
      } else {
          // User not found
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
  const { username, firstname, lastname, phone, email, password, verified } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (username, firstname, lastname, phone, email, password, verified)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    db.run(
      query,
      [username, firstname, lastname, phone, email, hashedPassword, verified], // Use hashedPassword instead of password
      async function (err) {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ error: 'Error creating user' });
        } else {
          console.log(`User created successfully.`);

          // Sending email and SMS
          try {
            const mailOptions = {
              from: 'joejuicecbs@gmail.com',
              to: email,
              subject: 'User Registration Confirmation',
              text: `Hello ${username},\n\nThank you for registering on our platform! Your account has been created successfully.`
            };

            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');

            const accountSid = 'AC2568c266f5a66782edf7eaa92c6d8ba7';
            const authToken = '57ae2f8ff3bbb716b1669186bd257edc';
            const client = require('twilio')(accountSid, authToken);
            console.log(phone);
            await client.messages.create({
              body: `Hello ${username},\n\nThank you for registering on our platform! Your account has been created successfully.`,
              from: '+14692084452',
              to: phone
            });
            console.log("SMS sent successfully");

            res.status(200).json({ message: 'User created successfully!' });
          } catch (sendingError) {
            console.error(sendingError);
            res.status(500).json({ error: 'Error sending confirmation email or SMS' });
          }
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error hashing password' });
  }
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


  router.get('/logout', (req, res) => {
    console.log('Logout route called'); // Add this for debugging
  
    // Clear the user session or cookie (if you're using cookies)
    res.clearCookie('userId'); // Assuming you set a 'userId' cookie during login
  
    // Redirect the user to the home page (home.html)
    res.redirect('/home.html');
  });
  

  module.exports = router; 