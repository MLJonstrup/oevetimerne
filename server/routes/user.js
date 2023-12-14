const express = require("express");
const path = require("path");
const router = express.Router();
const cookieParser = require("cookie-parser");
const sqlite3 = require("sqlite3").verbose();
const dbPath = "root/JoeForum/server/database.db";
const db = new sqlite3.Database(dbPath);

router.post("/createUser", async (req, res) => {
  const {
    userID,
    username,
    firstname,
    lastname,
    phone,
    email,
    password,
    verified,
  } = req.body;
  const query = `
    INSERT INTO posts (userID, username, firstname, lastname, phone, email , password , verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
  db.run(
    query,
    [userID, username, firstname, lastname, phone, email, password, verified],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Error creating user" });
      } else {
        console.log(`User created successfully.`);
        res.status(200).json({ message: "User created successfully!" });
      }
    }
  );
});
