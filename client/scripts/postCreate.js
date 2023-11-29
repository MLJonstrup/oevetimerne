//To external database cloudinary.com
/*const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: "dnppfpwxu",
    api_key: "224459111176265",
    api_secret: "BvipRaDqYA0WfBlqheWyZnRGncc",
});*/

document.addEventListener('DOMContentLoaded', () => {
  const createform = document.getElementById('createPostForm');
  createform.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Create a JavaScript object with form data
    const newPost = {
      title: document.getElementById('title').value,
      productId: parseInt(document.getElementById('productId').value),
      postAuthor: parseInt(document.getElementById('postAuthor').value),
      content: document.getElementById('content').value,
      stars: parseInt(document.getElementById('stars').value),
      imgUrl: document.getElementById('imgUrl').value,
    };

    try {
      const response = await fetch('/post/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });
      if (response.ok) {
        console.log('Post created successfully!');
      } 
    } catch (error) {
      console.error('An error occurred:', error);
    }
  });
});
