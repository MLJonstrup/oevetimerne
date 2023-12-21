const express = require("express");
const path = require("path");
const router = express.Router();
const cookieParser = require("cookie-parser");
const sqlite3 = require("sqlite3").verbose();

// Definerer stien til databasen og initialiserer SQLite databaseforbindelsen
const dbPath = path.resolve(__dirname, "../database.db");
const db = new sqlite3.Database(dbPath);

// Bruger cookieParser middleware for bedre at kunne håndtere cookies i forespørgsler
router.use(cookieParser());

// Route handler for at hente alle kommentarer knyttet til et specifikt opslag
// Denne route er nyttig for at vise kommentarer på en opslagsside
router.get("/post/:postId", (req, res) => {
  const postId = req.params.postId;
 // Forespørgsel for at hente kommentarer og forfatterens brugernavn for et givent opslag
  const query = `
    SELECT comments.*, users.username
    FROM comments
    JOIN users ON comments.commentsAuthor = users.id
    WHERE comments.postId = ?;
  `;

 // Kører forespørgslen og håndterer resultatet eller eventuelle fejl
  db.all(query, [postId], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Error fetching user posts" });
    } else {
      console.log("Resulting Rows:", rows); 
      res.status(200).json(rows);
    }
  });
});

// Route handler for at oprette en ny kommentar til et opslag
// Tillader brugere at tilføje deres kommentarer til et opslag
router.post("/createComment", async (req, res) => {
  const { postId, commentsAuthor, commentsContent } = req.body;
  // SQL-forespørgsel til at indsætte den nye kommentar i databasen
  const query = `
    INSERT INTO comments (postId, commentsAuthor, commentsContent)
    VALUES (?, ?, ?);
    `;
    // Kører forespørgslen for at indsætte en ny kommentar og håndterer resultatet
  db.run(query, [postId, commentsAuthor, commentsContent], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Error creating comment" });
    } else {
      console.log(`comment created successfully.`);
      res.status(200).json({ message: "comment created successfully!" });
    }
  });
});

// Eksporterer routeren for brug i andre dele af applikationen
module.exports = router;