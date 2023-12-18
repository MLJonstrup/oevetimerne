//USER ID FROM COOKIE FOR LATER
/*const userId = document.cookie
.split('; ')
.find(cookie => cookie.startsWith('userId='))
.split('=')[1];*/

document.addEventListener("DOMContentLoaded", () => {
  const createform = document.getElementById("createPostForm");
  const upload = document.getElementById("upload_widget");
  const userId = 12; //USE COOKIE LATER
  let newPost = {
    title: "",
    productId: "",
    postAuthor: "",
    content: "",
    stars: "",
    imgUrl: "", // This will be updated after image upload
  };

  // Cloudinary widget from: https://cloudinary.com/documentation/javascript_image_and_video_upload
  const cloudName = "dnppfpwxu";

  let myWidget = cloudinary.createUploadWidget(
    {
      cloudName: cloudName,
      uploadPreset: "ml_default",
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        newPost.imgUrl = result.info.secure_url;
        document.getElementById("uploadedimage").src = newPost.imgUrl;
      }
    }
  );

  upload.addEventListener(
    "click",
    function () {
      myWidget.open();
    },
    false
  );

  // Add event listener for form submission
  createform.addEventListener("submit", async (event) => {
    event.preventDefault();

    (newPost.title = document.getElementById("title").value),
      (newPost.productId = parseInt(
        document.getElementById("productId").value
      )),
      (newPost.postAuthor = userId),
      (newPost.content = document.getElementById("content").value),
      (newPost.stars = parseInt(document.getElementById("stars").value));

    try {
      const response = await fetch("/post/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });
      if (response.ok) {
        setTimeout(() => {
          window.location.replace = ("/post");
        }, 0.4);
        alert(
          "Post created successfully! You will be automatically redirected in a few seconds."
        );
        console.log("Post created successfully!");
      } else {
        alert("Error creating post. Please try again.");
        console.error("Error creating post:", response.status);
        return;
      }
    } catch (error) {
      alert("Error creating post. Please try again.");
      console.error("An error occurred:", error);
    }
  });
});
