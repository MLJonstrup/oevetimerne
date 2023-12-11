const sqlite3 = require("sqlite3").verbose();

<<<<<<< HEAD
const dbPath =
  "/Users/kasperkamphrasmussen/Documents/GitHub/JoeForum/server/database.db";
=======
const dbPath = 'C:\\eksamen computer\\JoeForum\\database.db';

>>>>>>> main

// Retrieve it from the client side or in cookie
const userId = 11;
const commentId = 31; // Used to delete a comment

const newComment = {
  // Collected client side
  postId: 3, // Choose the post to attach the comment to
  commentsContent: "This is the content of the new comment.",
  commentsAuthor: userId,
};

function createComment(newComment) {
  const query = `
    INSERT INTO comments (postId, commentsContent, commentsAuthor)
    VALUES (?, ?, ?);
  `;

  // Create connection to the database
  const db = new sqlite3.Database(dbPath);

  // Run the query
  db.run(
    query,
    [newComment.postId, newComment.commentsContent, newComment.commentsAuthor],
    function (err) {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`Comment added successfully. Comment ID: ${this.lastID}`);
      }
      db.close();
    }
  );
}

function deleteComment(commentId, userId) {
  // Query to run
  const query = `
    DELETE FROM comments
    WHERE id = ? AND commentsAuthor = ?;
  `;

  // Creating connection to the database
  const db = new sqlite3.Database(dbPath);

  // Running the SQLite3 query
  db.run(query, [commentId, userId], function (err) {
    if (err) {
      console.error(err.message);
      console.log(
        "Comment deletion failed. Make sure you're the author of the comment."
      );
    } else if (this.changes === 0) {
      console.log(
        "Comment not found or you don't have permission to delete it."
      );
    } else {
      console.log(`Comment deleted successfully.`);
    }

    // Close the database connection
    db.close();
  });
}

deleteComment(commentId, userId);
//createComment(newComment);
