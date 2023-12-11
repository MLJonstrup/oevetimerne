const express = require("express");
const path = require("path");
const router = express.Router();
const cookieParser = require("cookie-parser");
const sqlite3 = require("sqlite3").verbose();
const dbPath = "./database.db";
const db = new sqlite3.Database(dbPath);

router.use(cookieParser());

// Create post route
router.post("/createComment", async (req, res) => {
  const { postId, commentAuthor, content } = req.body;
  const query = `
    INSERT INTO comments (postId, commentAuthor, content)
    VALUES (?, ?, ?);
    `;
  db.run(query, [postId, commentAuthor, content], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Error creating comment" });
    } else {
      console.log(`Comment created successfully.`);
      res.status(200).json({ message: "Comment created successfully!" });
    }
  });
});

// Delete comment route
router.delete("/deleteComment", (req, res) => {
  const { commentId, userId } = req.body;

  // Query to run
  const query = `
    DELETE FROM comments
    WHERE id = ? AND commentAuthor = ?;
  `;

  // Creating connection to the database
  const db = new sqlite3.Database(dbPath);

  // Running the SQLite3 query based on commentId and userId
  db.run(query, [commentId, userId], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Comment deletion failed" });
    } else if (this.changes === 0) {
      res.status(404).json({ error: "Comment not found or you don't have permission to delete it" });
    } else {
      console.log(`Comment deleted successfully.`);
      res.status(200).json({ message: "Comment deleted successfully!" });
    }
  });
});

module.exports = router;
