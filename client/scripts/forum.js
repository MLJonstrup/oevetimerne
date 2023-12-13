document.addEventListener("DOMContentLoaded", () => {

  async function fetchUserPosts() {
    try {
      fetch("http://161.35.86.140/post/posts")
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error("Error fetching data:", error));
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
        const threadContainer = document.getElementById("thread");

        // Clear the existing content in the thread container
        threadContainer.innerHTML = "";

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

        comments.forEach((comment) => {
            // Append comments to the thread container
            appendComment(comment);
        });
      } else {
        console.error("Failed to fetch user posts:", response.status);
      }
    } catch (error) {
        alert("Failed to fetch comments.");
        console.error("An error occurred:", error);
    }

    // Define the appendComment function
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
  }
  fetchUserPosts();
});
