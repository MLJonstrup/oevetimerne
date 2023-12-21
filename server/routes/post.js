//inspiration er fundet ved følgene; https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/
// Importerer de nødvendige moduler
const express = require("express");
const path = require("path");
const router = express.Router();
const cookieParser = require("cookie-parser");
const sqlite3 = require("sqlite3").verbose();

// Opsætter database stien og initialiserer SQLite databasen
const dbPath = path.resolve(__dirname, "../database.db");
const db = new sqlite3.Database(dbPath);

// Bruger cookieParser middleware til at håndtere cookies
router.use(cookieParser());

// Route handler for hjemmesiden
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/posts.html"));
});

// Route handler for at oprette et nyt opslag
router.get("/createPost", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/createPost.html"));
});

// Route handler for at slette et opslag
router.get("/deletePost", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/deletePost.html"));
});

// Route handler for at opdatere et opslag
router.get("/updatePost", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/updatePost.html"));
});

// Route handler for at hente opslag med en begrænsning på 20, sorteret efter opslagsdato
router.get("/posts", (req, res) => {

  const query = `
    SELECT *
    FROM posts
    ORDER BY postDate DESC
    LIMIT 20;
  `;
   // Kører forespørgslen for at hente opslag
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Error fetching posts" });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Route handler for at hente opslag af en bestemt bruger
router.get("/userPosts/:userId", (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT * FROM posts
    WHERE postAuthor = ?;
  `;

// Kører forespørgslen for at hente brugerens opslag
  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Error fetching user posts" });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Route handler for at oprette et nyt opslag
router.post("/createPost", async (req, res) => {
  const { title, productId, postAuthor, content, stars, imgUrl } = req.body;
  const query = `
    INSERT INTO posts (title, productId, postAuthor, content, stars, imgUrl)
    VALUES (?, ?, ?, ?, ?, ?);
    `;
      // Kører forespørgslen for at indsætte et nyt opslag
  db.run(
    query,
    [title, productId, postAuthor, content, stars, imgUrl],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Error creating post" });
      } else {
        res.status(200).json({ message: "Post created successfully!" });
      }
    }
  );
});
// Route handler for at opdatere et eksisterende opslag

router.put("/updatePost", async (req, res) => {
  const { userId, postId, imgUrl, stars, content, productId, title } = req.body;
  // Query der opdatere et post fra ID og author
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

// Kører forespørgslen for at opdatere et opslag
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
        res.status(200).json({ message: "Post updated successfully!" });
      }
    }
  );
});

// Route handler for at slette et opslag
router.delete("/deletePost", async (req, res) => {
  const { postId, userId } = req.body;
  //const {userId} = req.cookies.userId; FOR LATER WHEN USER COOKIE IS IMPLEMENTED

  // Kører SQLite3 forespørgslen
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
      res.status(200).json({ message: "Post deleted successfully!" });
    }
  });
});

// Eksporterer routeren
module.exports = router;
 