//To external database cloudinary.com
/*const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: "dnppfpwxu",
    api_key: "224459111176265",
    api_secret: "BvipRaDqYA0WfBlqheWyZnRGncc",
});*/

const sqlite3 = require('sqlite3').verbose();

const dbPath = '../../database.db';

// retrieve it from the client side or in cookie
const userId = 12;
const postId = 3; //used to delete a post

const newPost = { //collected client side
  title: 'New Post',
  productId: 11, //choose a product from list and translate the chosen product to a productId
  postAuthor: userId, 
  content: 'This is the content of the new post.',
  stars: 4,
  imgUrl: 'https://i0.wp.com/www.gaddiscompany.com/wp-content/uploads/2016/05/missing-image-placeholder-1024x575.jpg?resize=736%2C414&ssl=1' // Replace with the actual image URL
};

const editPost = {
    title: 'Updated Title',
    productId: 11, //choose a product from list and translate the chosen product to a productId
    content: 'Updated content',
    stars: 5,
    imgUrl: 'https://example.com/path/to/updated-image.jpg'
  };

function createPost(newPost) {
  const query = `
    INSERT INTO posts (title, productId, postAuthor, content, stars, imgUrl)
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  //create connection to the database
  const db = new sqlite3.Database(dbPath);

  //run the query
  db.run(
    query,
    [
    newPost.title,
    newPost.productId,
    newPost.postAuthor,
    newPost.content,
    newPost.stars,
    newPost.imgUrl
    ],
    function (err) {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`Post added successfully. Post ID: ${this.lastID}`);
      }

      db.close();
    }
  );
}

function deletePost(postId, userId) {
  //query to run
  const query = `
    DELETE FROM posts
    WHERE id = ? AND postAuthor = ?;
  `;

  //creating connection to the database
  const db = new sqlite3.Database(dbPath);

  //running the sqlite3 query
  db.run(query, [postId, userId], function (err) {
    if (err) {
      console.error(err.message);
      console.log("Post deletion failed. Make sure you're the author of the post.");
    } else if (this.changes === 0) {
      console.log("Post not found or you don't have permission to delete it.");
    } else {
      console.log(`Post deleted successfully.`);
    }

    //close the database connection
    db.close();
  });
}
  
function updatePost(postId, userId, editPost) {
//query to update a post by ID and author
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

// Create connection to the database
const db = new sqlite3.Database(dbPath);

// Run the query
db.run(
    query,
    [
    editPost.title,
    editPost.productId,
    editPost.content,
    editPost.stars,
    editPost.imgUrl,
    postId,
    userId
    ],
    function (err) {
    if (err) {
        console.error(err.message);
        console.log("Post update failed. Make sure you're the author of the post.");
    } else if (this.changes === 0) {
        console.log("Post not found or you don't have permission to update it.");
    } else {
        console.log(`Post updated successfully.`);
    }

    // Close the database connection
    db.close();
    }
);
}
 
updatePost(postId, userId, editPost);

//deletePost(postId, userId);

//createPost(newPost);