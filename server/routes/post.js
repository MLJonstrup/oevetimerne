const express = require("express");
const path = require("path");
const router = express.Router();
const cookieParser = require("cookie-parser");
const sqlite3 = require("sqlite3").verbose();
const dbPath = "./database.db";
const db = new sqlite3.Database(dbPath);

router.use(cookieParser());

// Define route handlers
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/posts.html"));
});

router.get("/createPost", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/createPost.html"));
});

router.get("/deletePost", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/deletePost.html"));
});

router.get("/updatePost", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/updatePost.html"));
});

// New route to fetch all posts
router.get("/posts", (req, res) => {

  const query = `
    SELECT *
    FROM posts
    ORDER BY postDate DESC
    LIMIT 20;
  `;
  // Run the query
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Error fetching posts" });
    } else {
      console.log(`Last 20 posts fetched successfully.`);
      res.status(200).json(rows);
    }
  });
});

router.get("/userPosts/:userId", (req, res) => {
  const userId = req.params.userId;
  // Query to fetch user posts
  const query = `
    SELECT * FROM posts
    WHERE postAuthor = ?;
  `;

  // Run the query
  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Error fetching user posts" });
    } else {
      console.log(`User posts fetched successfully.`);
      res.status(200).json(rows);
    }
  });
});

module.exports = router;
 