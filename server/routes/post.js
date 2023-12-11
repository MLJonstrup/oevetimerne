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

// Create post route
router.post("/createPost", async (req, res) => {
  const { title, productId, postAuthor, content, stars, imgUrl } = req.body;
  const query = `
    INSERT INTO posts (title, productId, postAuthor, content, stars, imgUrl)
    VALUES (?, ?, ?, ?, ?, ?);
    `;
  db.run(
    query,
    [title, productId, postAuthor, content, stars, imgUrl],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Error creating post" });
      } else {
        console.log(`Post created successfully.`);
        res.status(200).json({ message: "Post created successfully!" });
      }
    }
  );
});

router.post("/updatePost", async (req, res) => {
  const { userId, postId, imgUrl, stars, content, productId, title } = req.body;

  // Query to update a post by ID and author
  const query = `
        UPDATE posts
        SET
        title = COALESCE(?, title),
        productId = COALESCE(?, productId),
        content = COALESCE(?, content),
        stars = COALESCE(?, stars),
        imgUrl = COALESCE(?, imgUrl)
        WHERE
        id = ? AND postAuthor = ?;
    `;

  // Run the query
  db.run(
    query,
    [
      title || null,
      productId || null,
      content || null,
      stars || null,
      imgUrl || null,
      postId,
      userId,
    ],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({
          error: "Post update failed. Make sure you're the author of the post.",
        });
      } else if (this.changes === 0) {
        console.error(err.message);
        res.status(500).json({
          error: "Post not found or you don't have permission to update it.",
        });
      } else {
        console.log(`Post updated successfully.`);
        res.status(200).json({ message: "Post updated successfully!" });
      }
    }
  );
});

router.post("/deletePost", async (req, res) => {
  const { postId, userId } = req.body;
  //const {userId} = req.cookies.userId; FOR LATER WHEN USER COOKIE IS IMPLEMENTED

  //query to run
  const query = `
    DELETE FROM posts
    WHERE id = ? AND postAuthor = ?;
  `;
  //running the sqlite3 query
  db.run(query, [postId, userId], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({
        error: "Post deletion failed. Make sure you're the author of the post.",
      });
    } else if (this.changes === 0) {
      console.error(err.message);
      res.status(500).json({
        error: "Post not found or you don't have permission to delete it.",
      });
    } else {
      console.log(`Post deleted successfully.`);
      res.status(200).json({ message: "Post deleted successfully!" });
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
