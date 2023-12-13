document.addEventListener("DOMContentLoaded", () => {
  const updateForm = document.getElementById("updatePostForm");
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

        // Iterate through each post in the array
        posts.forEach((post) => {
          // Create a div element for each post
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

          // Append the post div to the container
          postsContainer.appendChild(postDiv);
        });
      } else {
        console.error("Failed to fetch user posts:", response.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  fetchUserPosts();

  updateForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Create a JavaScript object with form data
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
        setTimeout(() => {
          window.location.href = "http://161.35.86.140/post";
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
