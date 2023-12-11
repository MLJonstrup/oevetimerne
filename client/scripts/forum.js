document.addEventListener("DOMContentLoaded", () => {
  const userId = 12; //vores user id skal komeme fra en cookie

  async function fetchUserPosts() {
    try {
      const response = await fetch(`/post/userPosts/${userId}`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const posts = await response.json();
      const postsContainer = document.getElementById("topics");

      posts.forEach((post) => {
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
      console.log(comments);
      const threadContainer = document.getElementById("thread");

      //threadContainer.innerHTML = "<h2>Thread</h2>";

      comments.forEach((comment) => {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");

        const authorDiv = document.createElement("div");
        authorDiv.textContent = `Author: ${comment.commentsAuthor}`;
        commentDiv.appendChild(authorDiv);

        const contentDiv = document.createElement("div");
        contentDiv.textContent = comment.commentsContent;
        commentDiv.appendChild(contentDiv);

        const dateDiv = document.createElement("div");
        dateDiv.textContent = `Posted on: ${comment.commentsDate}`;
        commentDiv.appendChild(dateDiv);

        threadContainer.appendChild(commentDiv);
      });
    } catch (error) {
      alert("Failed to fetch comments.");
      console.error("An error occurred:", error);
    }
  }

  fetchUserPosts();
});
