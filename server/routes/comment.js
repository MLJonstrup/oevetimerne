const express = require("express");
const path = require("path");
const router = express.Router();
const cookieParser = require("cookie-parser");
const sqlite3 = require("sqlite3").verbose();
const dbPath = "root/JoeForum/server/database.db";
const db = new sqlite3.Database(dbPath);

router.use(cookieParser());

router.get("/post/:postId", (req, res) => {
  const postId = req.params.postId;
  // Query to fetch user posts
  const query = `
          SELECT * FROM comments
          WHERE postId = ?;
      `;

  // Run the query
  db.all(query, [postId], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Error fetching user posts" });
    } else {
      console.log(`User comments fetched successfully.`);
      res.status(200).json(rows);
    }
  });
});

// Create post route
router.post("/createComment", async (req, res) => {
  const { postId, commentsAuthor, commentsContent } = req.body;
  const query = `
    INSERT INTO comments (postId, commentsAuthor, commentsContent)
    VALUES (?, ?, ?);
    `;
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

module.exports = router;