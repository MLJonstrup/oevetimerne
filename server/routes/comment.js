const express = require('express');
const path = require('path');
const router = express.Router();
const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3').verbose();
const dbPath = '././database.db';
const db = new sqlite3.Database(dbPath);

router.use(cookieParser());

// Create post route
router.post('/createComment', async (req, res) => { 
    const { postId, postAuthor, content } = req.body;  
    const query = `
    INSERT INTO comments (postId, postAuthor, content)
    VALUES (?, ?, ?);
    `;
    db.run(
        query, 
        [postId, postAuthor, content],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Error creating post' });
            } else {
                console.log(`Post created successfully.`);
                res.status(200).json({ message: 'Post created successfully!'});
            }
        }
    );
});