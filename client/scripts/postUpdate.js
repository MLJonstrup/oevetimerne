document.addEventListener("DOMContentLoaded", async () => {
  const updateForm = document.getElementById("updatePostForm");

  try {
    const response = await axios.get("/user/details", {
      withCredentials: true,
    });

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

  async function fetchUserPosts() {
    try {
      const response = await fetch(`/post/userPosts/${userId}`);
      if (response.ok) {
        const posts = await response.json();
        const postsContainer = document.getElementById("postsContainer");

        posts.forEach((post) => {
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
          window.location.href = "https://joejuiceforum.social/post";
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
