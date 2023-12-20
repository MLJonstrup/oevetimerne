document.addEventListener("DOMContentLoaded", async () => {
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
      const response = await fetch("/post/posts");
      if (response.ok) {
        const posts = await response.json();
        const postsContainer = document.getElementById("topics");

        // Iterate through each post in the array
        posts.forEach((post) => {
          // Create a div element for each post
          const postDiv = document.createElement("div");
          postDiv.id = `post_${post.id}`;
          postDiv.classList.add("post");

          const titleDiv = document.createElement("div");
          titleDiv.textContent = post.title;
          postDiv.appendChild(titleDiv);

          const dateDiv = document.createElement("div");
          dateDiv.textContent = post.postDate;
          postDiv.appendChild(dateDiv);

          const contentDiv = document.createElement("div");
          contentDiv.textContent = post.content;
          postDiv.appendChild(contentDiv);

          const imgDiv = document.createElement("div");
          imgDiv.classList.add("img");
          imgDiv.style.backgroundImage = `url(${post.imgUrl})`;
          postDiv.appendChild(imgDiv);

          postDiv.addEventListener("click", () =>
            fetchAndDisplayComments(post.id)
          );

          postsContainer.appendChild(postDiv);
        });
      } else {
        console.error("Failed to fetch user posts:", response.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  async function fetchAndDisplayComments(postId) {
    try {
      const response = await fetch(`/comments/post/${postId}`);
      if (response.ok) {
        const comments = await response.json();
        console.log(comments);
        const threadContainer = document.getElementById("thread");

        //const userId = 12;
        // Clear the existing content in the thread container
        threadContainer.innerHTML = "";

        // Add the <h2>Thread</h2> element
        const threadHeading = document.createElement("h2");
        threadHeading.textContent = "Thread";
        threadContainer.appendChild(threadHeading);

        comments.forEach((comment) => {
          const commentDiv = document.createElement("div");
          commentDiv.textContent = `${comment.username}: ${comment.commentsContent}`;
          commentDiv.classList.add("comment");
          threadContainer.appendChild(commentDiv);
        });

        // Create a textarea for entering comments
        const commentText = document.createElement("textarea");
        commentText.id = "commentText";
        commentText.placeholder = "Enter your comment";
        threadContainer.appendChild(commentText);

        // Create a button for adding comments
        const addCommentBtn = document.createElement("button");
        addCommentBtn.id = "addCommentBtn";
        addCommentBtn.textContent = "Add Comment";
        threadContainer.appendChild(addCommentBtn);

        // Event listener for adding comments
        addCommentBtn.addEventListener("click", async () => {
          const commentContent = commentText.value.trim();

          // Check if commentContent is not empty
          if (commentContent === "") {
            alert("Please enter a comment.");
            return;
          }

          const newComment = {
            postId: postId,
            commentsContent: commentContent,
            commentsAuthor: userId,
          };

          try {
            const response = await fetch("/comments/createComment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newComment),
            });

            if (response.ok) {
              // Append the new comment to the thread
            }
          } catch (error) {
            console.error("An error occurred:", error);
          }
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  fetchUserPosts();
});
