//kode inspiretet fra følgene side https://dev.to/m_josh/build-a-jwt-login-and-logout-system-using-expressjs-nodejs-hd2 og 
//https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/
const express = require('express');
const path = require('path');
const router = express.Router();
const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3').verbose();
const dbPath = './database.db';
const db = new sqlite3.Database(dbPath);
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Opsætter nodemailer til at sende emails
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "joejuicecbs@gmail.com",
    pass: "vwko ujkw ifla qqnm",
  },
});

//kode inspiretet fra følgene side https://www.tabnine.com/code/javascript/functions/express/Request/login
// Login route handler
router.post("/login", (req, res) => {
  const { username, password } = req.body;

 // Henter brugeren fra databasen
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
      }

      if (row) {
          // Sammenligner det indtastede kodeord med det hashede kodeord
          const match = await bcrypt.compare(password, row.password);

          if (match) {
              // Kodeord matcher, fortsæt med login
              res.cookie('userId', row.id, { httpOnly: true });
              console.log("Cookie set with userId:", row.id);
              res.status(200).send('Login successful!');
          } else {
              // Kodeord matcher ikke
              res.status(401).send('Invalid username or password');
          }
      } else {
         // Bruger ikke fundet
          res.status(401).send('Invalid username or password');
      }
  });
});

// Detalje route handler
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
          userId: row.id
        });
      } else {
        res.status(404).send('User not found');
      }
    });
  });



// Route handlers til at vise sider for oprettelse og sletning af brugere
  router.get('/createUser', (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/createUser.html"));
});
router.get('/deleteUser', (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/deleteUser.html"));
});



//vi har fået inspiration fra følgenehttps://www.twilio.com/docs/messaging/api?fbclid=IwAR22okBH_VbvUAolbSn9ztTVf3XzAiv4f8nOcxBX148uj_jjYQ-FEii7p2w
// Opret bruger route handler
router.post('/createUser', async (req, res) => { 
  const { username, firstname, lastname, phone, email, password, verified } = req.body;

  try {
     // Hasher kodeordet
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      // SQL-forespørgsel til indsættelse af den nye bruger i databasen
      const query = `
      INSERT INTO users (username, firstname, lastname, phone, email, password, verified)
      VALUES (?, ?, ?, ?, ?, ?, ?);
      `;

       // Kører forespørgslen og indsætter brugerdata
      db.run(
          query, 
          [username, firstname, lastname, phone, email, hashedPassword, verified], // Use hashedPassword instead of password
          function (err) {
              if (err) {
                  console.error(err.message);
                  res.status(500).json({ error: 'Error creating user' });

              } else {
                  console.log(`User created successfully.`);
                  res.status(200).json({ message: 'User created successfully!'});

                  // Opsætter og sender en bekræftelses-email
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
                  
                   // Sender en bekræftelses-SMS via Twilio
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
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Error hashing password' });
  }
});

// Route handler til at slette en bruger
router.post('/deleteUser', (req, res) => {
    const { username, password } = req.body;
  
     // Forespørger databasen for at se, om brugernavn og kodeord matcher
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
  
      if (row) {
         // Bruger fundet, slet brugeren fra databasen
        db.run('DELETE FROM users WHERE username = ? AND password = ?', [username, password], function (err) {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }
  
           // Tjekker, om der er påvirkede rækker (bruger slettet)
          if (this.changes > 0) {
            
            console.log("Bruger slettet");
            return res.status(200).send('User deleted successfully.');
     
          } else {
            // Ingen påvirkede rækker, bruger ikke fundet eller forkert kodeord
            return res.status(401).send('No rows affected');
          }
        });
      } else {
        // Bruger ikke fundet eller forkert kodeord
        res.status(401).send('Invalid username or password');
      }
    });
  });
  
  // Route handler for logud
  router.get('/logout', (req, res) => {
    console.log('Logout route called'); // Tilføjet for fejlsøgning

    // Rydder brugerens session eller cookie (hvis cookies anvendes)
    res.clearCookie('userId'); // Antager at et 'userId' cookie blev sat under login

  
    // Omdirigerer brugeren til hjemmesiden
    res.redirect('https://joejuiceforum.social/');
  });
  
// Eksporterer routeren for anvendelse i andre dele af applikationen
  module.exports = router; 