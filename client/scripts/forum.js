document.addEventListener("DOMContentLoaded", () => {
  const userId = 12; // Replace with logic to get user ID from a cookie

  async function fetchUserPosts() {
    try {
      const response = await fetch(`/post/posts`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const posts = await response.json();
      const postsContainer = document.getElementById("topics");

      posts.forEach((post) => {
        const postDiv = createPostDiv(post);
        postsContainer.appendChild(postDiv);
      });
    } catch (error) {
      alert("Failed to fetch user posts.");
      console.error("An error occurred:", error);
    }
  }

  async function fetchAndDisplayComments(postId) {
    try {
      const response = await fetch(`/comments/post/${postId}`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const comments = await response.json();
      const threadContainer = document.getElementById("thread");

      clearThreadContainer(threadContainer);

      // Create a textarea and button for adding comments
      const commentText = createCommentTextarea();
      const addCommentBtn = createAddCommentButton();

      threadContainer.appendChild(commentText);
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
            appendComment(newComment);

            // Clear the comment textarea
            commentText.value = "";
          } else {
            alert("Error adding comment. Please try again.");
            console.error("Error adding comment:", response.status);
          }
        } catch (error) {
          alert("Error adding comment. Please try again.");
          console.error("An error occurred:", error);
        }
      });

      // Append existing comments to the thread container
      comments.forEach((comment) => {
        appendComment(comment);
      });
    } catch (error) {
      alert("Failed to fetch comments.");
      console.error("An error occurred:", error);
    }
  }

  function createPostDiv(post) {
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

    postDiv.addEventListener("click", () => fetchAndDisplayComments(post.id));

    return postDiv;
  }

  function clearThreadContainer(container) {
    // Clear the existing content in the thread container
    container.innerHTML = "";
  }

  function createCommentTextarea() {
    const commentText = document.createElement("textarea");
    commentText.id = "commentText";
    commentText.placeholder = "Enter your comment";
    return commentText;
  }

  function createAddCommentButton() {
    const addCommentBtn = document.createElement("button");
    addCommentBtn.id = "addCommentBtn";
    addCommentBtn.textContent = "Add Comment";
    return addCommentBtn;
  }

  function appendComment(comment) {
    const commentDiv = document.createElement("div");
    const threadContainer = document.getElementById("thread");
    commentDiv.classList.add("comment");

    const authorDiv = document.createElement("div");
    authorDiv.textContent = `Author: ${comment.commentsAuthor}`;

    const contentDiv = document.createElement("div");
    contentDiv.textContent = comment.commentsContent;

    commentDiv.appendChild(authorDiv);
    commentDiv.appendChild(contentDiv);

    threadContainer.appendChild(commentDiv);
  }

  fetchUserPosts();
});
