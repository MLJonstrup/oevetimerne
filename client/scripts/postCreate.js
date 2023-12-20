document.addEventListener("DOMContentLoaded", async () => {
  const createform = document.getElementById("createPostForm");
  const upload = document.getElementById("upload_widget");

  try {
    const response = await axios.get('/user/details', { withCredentials: true });

    // Assuming the server responds with user details
    const user = response.data;
    console.log('User details:', user);
    var userId = user.userId;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('User is not authenticated');
    } else {
      console.error('Error fetching user details:', error.message);
    }
  }
  console.log(userId);

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
          window.location.href = "https://joejuiceforum.social/post";
        }, 0.2);
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
