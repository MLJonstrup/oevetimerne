const express = require("express");
const path = require("path");
const router = express.Router();
const cookieParser = require("cookie-parser");
const sqlite3 = require("sqlite3").verbose();
const dbPath = path.resolve(__dirname, "../database.db");
const db = new sqlite3.Database(dbPath);

router.use(cookieParser());

const routes = [
  { path: "/", file: "posts.html" },
  { path: "/createPost", file: "createPost.html" },
  { path: "/deletePost", file: "deletePost.html" },
  { path: "/updatePost", file: "updatePost.html" },
  { path: "/posts", handler: getPosts },
  { path: "/userPosts/:userId", handler: getUserPosts },
  { path: "/createPost", method: "post", handler: createPost },
  { path: "/updatePost", method: "put", handler: updatePost },
  { path: "/deletePost", method: "delete", handler: deletePost },
];

routes.forEach((route) => {
  if (route.handler) {
    if (route.method) {
      router[route.method](route.path, route.handler);
    } else {
      router.get(route.path, route.handler);
    }
  } else {
    router.get(route.path, (req, res) => {
      res.sendFile(path.join(__dirname, `../../client/pages/${route.file}`));
    });
  }
});

function getPosts(req, res) {
  const query = `
    SELECT *
    FROM posts
    ORDER BY postDate DESC
    LIMIT 20;
  `;
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Error fetching posts" });
    } else {
      res.status(200).json(rows);
    }
  });
}

function getUserPosts(req, res) {
  const userId = req.params.userId;
  const query = `
    SELECT * FROM posts
    WHERE postAuthor = ?;
  `;
  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Error fetching user posts" });
    } else {
      res.status(200).json(rows);
    }
  });
}

function createPost(req, res) {
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
        res.status(200).json({ message: "Post created successfully!" });
      }
    }
  );
}

function updatePost(req, res) {
  const { userId, postId, imgUrl, stars, content, productId, title } = req.body;
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
}

function deletePost(req, res) {
  const { postId, userId } = req.body;
  const query = `
    DELETE FROM posts
    WHERE id = ? AND postAuthor = ?;
  `;
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
}

module.exports = router;
