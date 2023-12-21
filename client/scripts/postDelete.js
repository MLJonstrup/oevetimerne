document.addEventListener("DOMContentLoaded", async () => {
  // Hent DOM-elementer
  const deleteform = document.getElementById("deletePostForm");

   try {
    // Forsøg at hente brugeroplysninger fra serveren med credentials
    const response = await axios.get("/user/details", {
      withCredentials: true,
    });
    // Antager, at serveren responderer med brugeroplysninger
    const user = response.data;
    console.log("User details:", user);
    var userId = user.userId;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log("User is not authenticated");
    } else {
      console.error("Error fetching user details:", error.message);
    }
  }
  console.log(userId);


  // Funktion til at hente brugerens indlæg fra serveren
  async function fetchUserPosts() {
    try {
      const response = await fetch(`/post/userPosts/${userId}`);
      if (response.ok) {
        const posts = await response.json();
        const postsContainer = document.getElementById("postsContainer");

        // Gennemgå hvert indlæg i arrayet og opret HTML-kode for det
        posts.forEach((post) => {
          const postDiv = document.createElement("div");
          postDiv.id = `post_${post.id}`;
          postDiv.classList.add("post");

          const deleteButton = document.createElement("button");
          deleteButton.classList.add("deleteButton");
          deleteButton.dataset.postId = post.id;
          deleteButton.textContent = "Delete";
          postDiv.appendChild(deleteButton);

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

          // Tilføj post-div til containeren
          postsContainer.appendChild(postDiv);
        });
      } else {
        alert("Failed to fetch user posts.");
        console.error("Failed to fetch user posts:", response.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    // Vedhæfter event listeners til slet-knapperne
    attachDeleteEventListeners();
  }
// Kald funktionen for at hente og vise brugerens indlæg
  fetchUserPosts();

  // Funktion til at vedhæfte event listeners til slet-knapperne
  function attachDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll(".deleteButton");

    deleteButtons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        console.log("Adding event listener to delete button");

        const postId = button.dataset.postId;

        try {
          const response = await fetch("/post/deletePost", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, postId }),
          });

          if (response.ok) {
            console.log("Post deleted successfully!");
             // Valgfrit: Opdater UI for at afspejle sletning
            const postDiv = document.getElementById(`post_${postId}`);
            if (postDiv) {
              postDiv.remove();
            }
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
      });
    });
  }
});
