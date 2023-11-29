document.addEventListener('DOMContentLoaded', () => {
const deleteform = document.getElementById('deletePostForm');
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
        const postsContainer = document.getElementById('postsContainer');

        // Iterate through each post in the array
        posts.forEach(post => {
          // Create a div element for each post
          const postDiv = document.createElement('div');
          postDiv.id = `post_${post.id}`;
          postDiv.classList.add('post');

          // Create and append elements for post details
          const titleDiv = document.createElement('div');
          titleDiv.id = 'postTitle';
          titleDiv.textContent = post.title;
          postDiv.appendChild(titleDiv);

          const dateDiv = document.createElement('div');
          dateDiv.id = 'postDate';
          dateDiv.textContent = post.postDate;
          postDiv.appendChild(dateDiv);

          const contentDiv = document.createElement('div');
          contentDiv.id = 'postContent';
          contentDiv.textContent = post.content;
          postDiv.appendChild(contentDiv);

          const imgDiv = document.createElement('div');
          imgDiv.classList.add('img');
          imgDiv.style.backgroundImage = `url(${post.imgUrl})`;
          postDiv.appendChild(imgDiv);

          // Append the post div to the container
          postsContainer.appendChild(postDiv);
        });
      } else {
        console.error('Failed to fetch user posts:', response.status);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  fetchUserPosts();

  deleteform.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const postId = parseInt(document.getElementById('postId').value);
    try {
      const response = await fetch('/post/deletePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId, postId}),
      });
      if (response.ok) {
        console.log('Post deleted successfully!');
      } 
    } catch (error) {
      console.error('An error occurred:', error);
    }
  });
});