document.addEventListener("DOMContentLoaded", () => {
  const deleteform = document.getElementById("deletePostForm");
  const userId = 12;
  //USER ID FROM COOKIE FOR LATER
  /*const userId = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('userId='))
    .split('=')[1];*/

  async function fetchUserPosts() {
    try {
      const response = await fetch(`/post/userPosts/${userId}`);
      if (response.ok) {
        const posts = await response.json();
        const postsContainer = document.getElementById("postsContainer");

        // Iterate through each post in the array and create html code for it.
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

          // Append the post div to the container
          postsContainer.appendChild(postDiv);
        });
      } else {
        alert("Failed to fetch user posts.");
        console.error("Failed to fetch user posts:", response.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    attachDeleteEventListeners();
  }

  fetchUserPosts();

  function attachDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll(".deleteButton");

    deleteButtons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        console.log("Adding event listener to delete button");

        const postId = button.dataset.postId;

        try {
          const response = await fetch("/post/deletePost", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, postId }),
          });

          if (response.ok) {
            console.log("Post deleted successfully!");
            // Optionally, update the UI to reflect the deletion
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
