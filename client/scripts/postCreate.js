
//kode inspiretet fra følgene side: https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript
document.addEventListener("DOMContentLoaded", async () => {
  // Hent elementer fra DOM
  const createform = document.getElementById("createPostForm");
  const upload = document.getElementById("upload_widget");

  try {
    // Forsøg at hente brugeroplysninger fra serveren med credentials
    const response = await axios.get('/user/details', { withCredentials: true });

   // Antager, at serveren responderer med brugeroplysninger
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

  // Opret et objekt til at gemme oplysninger om det nye indlæg
  let newPost = {
    title: "",
    productId: "",
    postAuthor: "",
    content: "",
    stars: "",
    imgUrl: "", // Dette opdateres efter upload af billede
  };

// Cloudinary-widget fra: https://cloudinary.com/documentation/javascript_image_and_video_upload
  const cloudName = "dnppfpwxu";
// Opret Cloudinary-upload-widget
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

   // Tilføj en event listener til upload-knappen
  upload.addEventListener(
    "click",
    function () {
      myWidget.open();
    },
    false
  );

  // Tilføj event listener til formularindsendelse
  createform.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Indsaml oplysninger fra formularfeltene
    (newPost.title = document.getElementById("title").value),
      (newPost.productId = parseInt(
        document.getElementById("productId").value
      )),
      (newPost.postAuthor = userId),
      (newPost.content = document.getElementById("content").value),
      (newPost.stars = parseInt(document.getElementById("stars").value));

    try {
      // Send en POST-anmodning til serveren for at oprette indlægget
      const response = await fetch("/post/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });
      if (response.ok) {
        // Omdiriger brugeren til indlægssiden og vis en succesmeddelelse
        setTimeout(() => {
          window.location.href = "https://joejuiceforum.xyz/post";
        }, 0.2);
        alert(
          "Post created successfully! You will be automatically redirected in a few seconds."
        );
        console.log("Post created successfully!");
      } else {
        // Vis en fejlmeddelelse i tilfælde af en fejl i oprettelsen af ​​indlægget
        alert("Error creating post. Please try again.");
        console.error("Error creating post:", response.status);
        return;
      }
    } catch (error) {
      // Vis en fejlmeddelelse i tilfælde af en fejl
      alert("Error creating post. Please try again.");
      console.error("An error occurred:", error);
    }
  });
});
