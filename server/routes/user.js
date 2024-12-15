const express = require("express");
const path = require("path");
const router = express.Router();
const cookieParser = require("cookie-parser");
const sqlite3 = require("sqlite3").verbose();
const dbPath = "./database.db";
const db = new sqlite3.Database(dbPath);
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Opsætter nodemailer til at sende emails
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "joejuicecbs@gmail.com",
    pass: "vwko ujkw ifla qqnm", // Husk at bruge en app-adgangskode her
  },
});

// Login route handler
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Henter brugeren fra databasen
  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (row) {
      // Sammenligner det indtastede kodeord med det hashede kodeord
      const match = await bcrypt.compare(password, row.password);

      if (match) {
        // Kodeord matcher, fortsæt med login
        res.cookie("userId", row.id, { httpOnly: true });
        console.log("Cookie set with userId:", row.id);
        res.status(200).send("Login successful!");
      } else {
        // Kodeord matcher ikke
        res.status(401).send("Invalid username or password");
      }
    } else {
      // Bruger ikke fundet
      res.status(401).send("Invalid username or password");
    }
  });
});

// Detalje route handler
router.get("/details", (req, res) => {
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (row) {
      res.status(200).json({
        userId: row.id,
      });
    } else {
      res.status(404).send("User not found");
    }
  });
});

// Route handlers til at vise sider for oprettelse og sletning af brugere
router.get("/createUser", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/createUser.html"));
});
router.get("/deleteUser", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/deleteUser.html"));
});

// Opret bruger route handler
router.post("/createUser", async (req, res) => {
  const { username, firstname, lastname, phone, email, password, verified } = req.body;

  try {
    // Hasher kodeordet
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // SQL-forespørgsel til indsættelse af den nye bruger i databasen
    const query = `
      INSERT INTO users (username, firstname, lastname, phone, email, password, verified)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    db.run(
      query,
      [username, firstname, lastname, phone, email, hashedPassword, verified],
      function (err) {
        if (err) {
          console.error("Database error:", err.message);
          return res.status(500).json({ error: "Error creating user in the database" });
        }

        console.log(`User created successfully with ID: ${this.lastID}`);

        // Opsætter og sender en bekræftelses-email
        const mailOptions = {
          from: "joejuicecbs@gmail.com",
          to: email,
          subject: "User Registration Confirmation",
          text: `Hello ${username},\n\nThank you for registering on our platform! Your account has been created successfully.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Nodemailer error:", error.message);
            return res.status(500).json({ error: "Error sending confirmation email" });
          }

          console.log("Email sent successfully: " + info.response);

          // Sender en bekræftelses-SMS via Twilio
          const accountSid = "your_account_sid"; // Indsæt din Twilio Account SID
          const authToken = "your_auth_token"; // Indsæt din Twilio Auth Token
          const client = require("twilio")(accountSid, authToken);

          client.messages
            .create({
              body: `Hello ${username},\n\nThank you for registering on our platform! Your account has been created successfully.`,
              from: "+14692084452", // Verificeret Twilio-nummer
              to: phone,
            })
            .then((message) => {
              console.log("Twilio message sent, SID:", message.sid);
              res.status(200).json({ message: "User created successfully!" });
            })
            .catch((err) => {
              console.error("Twilio error:", err.message);
              res.status(500).json({ error: "Error sending SMS confirmation" });
            });
        });
      }
    );
  } catch (err) {
    console.error("Hashing error:", err.message);
    res.status(500).json({ error: "Error hashing password" });
  }
});

// Route handler til at slette en bruger
router.post("/deleteUser", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (row) {
      const match = await bcrypt.compare(password, row.password);
      if (match) {
        db.run(
          "DELETE FROM users WHERE username = ?",
          [username],
          function (err) {
            if (err) {
              console.error(err);
              return res.status(500).send("Internal Server Error");
            }

            if (this.changes > 0) {
              console.log("Bruger slettet");
              return res.status(200).send("User deleted successfully.");
            } else {
              return res.status(404).send("No user deleted");
            }
          }
        );
      } else {
        return res.status(401).send("Invalid username or password");
      }
    } else {
      res.status(404).send("User not found");
    }
  });
});

// Route handler for logud
router.get("/logout", (req, res) => {
  console.log("Logout route called");

  // Rydder brugerens session eller cookie (hvis cookies anvendes)
  res.clearCookie("userId"); // Antager at et 'userId' cookie blev sat under login

  // Omdirigerer brugeren til hjemmesiden
  res.redirect("https://joejuiceforum.xyz");
});

// Eksporterer routeren for anvendelse i andre dele af applikationen
module.exports = router;
