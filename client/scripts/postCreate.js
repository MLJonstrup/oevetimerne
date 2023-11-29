//USER ID FROM COOKIE FOR LATER
/*const userId = document.cookie
.split('; ')
.find(cookie => cookie.startsWith('userId='))
.split('=')[1];*/

document.addEventListener('DOMContentLoaded', () => {
  const createform = document.getElementById('createPostForm');
  const upload = document.getElementById("upload_widget")
  const userId = 12; //USE COOKIE LATER
  let newPost = {
    title: document.getElementById('title').value,
    productId: parseInt(document.getElementById('productId').value),
    postAuthor: userId,
    content: document.getElementById('content').value,
    stars: parseInt(document.getElementById('stars').value),
    imgUrl: "", // This will be updated after image upload
  };

  const cloudName = "dnppfpwxu"; 

  let myWidget = cloudinary.createUploadWidget({
    cloudName: cloudName, 
    uploadPreset: 'ml_default'}, (error, result) => { 
      if (!error && result && result.event === "success") { 
        console.log(result.info.secure_url, result.info.url);
        newPost.imgUrl = result.info.secure_url;
      }
    }
  )
  
  upload.addEventListener("click", function () 
    {myWidget.open();
    }
    ,false);

  // Add event listener for form submission
  createform.addEventListener('submit', async (event) => {
    event.preventDefault();

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
      } else {
        console.error('Error creating post:', response.status);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  });
});