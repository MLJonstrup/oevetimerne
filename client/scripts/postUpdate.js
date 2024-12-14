//kode inspiretet fra følgene side: https://www.codementor.io/@rahatkhannamappmechanic/how-to-update-a-user-s-status-in-realtime-in-javascript-g04od1y7l

document.addEventListener("DOMContentLoaded", async() => {
  const updateForm = document.getElementById("updatePostForm");

  // Forsøg at hente brugeroplysninger fra serveren med Axios
  try {
    const response = await axios.get("/user/details", {
      withCredentials: true,
    });

    // Hvis anmodningen er vellykket, gem brugeroplysningerne
    const user = response.data;
    console.log("User details:", user);
    var userId = user.userId;
  } catch (error) {
     // Håndter eventuelle fejl, f.eks. manglende autentifikation
    if (error.response && error.response.status === 401) {
      console.log("User is not authenticated");
    } else {
      console.error("Error fetching user details:", error.message);
    }
  }
  console.log(userId);

  // Funktion til at hente brugerens indlæg og vise dem på siden
  async function fetchUserPosts() {
    try {
      const response = await fetch(`/post/userPosts/${userId}`);
      if (response.ok) {
        const posts = await response.json();
        const postsContainer = document.getElementById("postsContainer");

       // Iterer gennem hvert indlæg i arrayet og opret HTML-elementer for dem
        posts.forEach((post) => {
          // Opretter div for hver post
          const postDiv = document.createElement("div");
          postDiv.id = `post_${post.id}`;
          postDiv.classList.add("post");

          const titleDiv = document.createElement("div");
          titleDiv.id = "postTitle";
          titleDiv.textContent = post.title;
          postDiv.appendChild(titleDiv);

          const dateDiv = document.createElement("div");
          dateDiv.id = "postDate";
          dateDiv.textContent = post.postDate;
          postDiv.appendChild(dateDiv);

          const contentDiv = document.createElement("div");
          contentDiv.id = "postContent";
          contentDiv.textContent = post.content;
          postDiv.appendChild(contentDiv);

          const imgDiv = document.createElement("div");
          imgDiv.classList.add("img");
          imgDiv.style.backgroundImage = `url(${post.imgUrl})`;
          postDiv.appendChild(imgDiv);

         // Tilføj det oprettede indlæg til containeren
          postsContainer.appendChild(postDiv);
        });
      } else {
        console.error("Failed to fetch user posts:", response.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  // Kald funktionen til at hente brugerens indlæg
  fetchUserPosts();

  // Tilføj en eventlistener til formularen for at opdatere indlæg
  updateForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Opret et JavaScript-objekt med formdata
    const updatePost = {
      title: document.getElementById("updateTitle").value,
      productId: parseInt(document.getElementById("updateProductId").value),
      content: document.getElementById("updateContent").value,
      stars: parseInt(document.getElementById("updateStars").value),
      imgUrl: document.getElementById("updateImgUrl").value,
      postId: parseInt(document.getElementById("updatePostId").value),
      userId: userId,
    };

    try {
      const response = await fetch("/post/updatePost", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePost),
      });
      if (response.ok) {
        console.log("Post updated successfully!");
        // Efter en vellykket opdatering omdiriger brugeren til indlægssiden
        setTimeout(() => {
          window.location.href = "https://joejuiceforum.xyz/post";
        }, 3000);
        alert(
          "Post updated successfully! You will be automatically redirected in a few seconds."
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  });
});
