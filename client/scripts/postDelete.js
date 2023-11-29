document.addEventListener('DOMContentLoaded', () => {
const deleteform = document.getElementById('deletePostForm');

  deleteform.addEventListener('submit', async (event) => {
    event.preventDefault();
    //USER ID FROM COOKIE FOR LATER
    /*const userId = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('userId='))
    .split('=')[1];*/
    const userId = {userId: 11};

    const postId = {
      postId: parseInt(document.getElementById('postId').value),
    };
    

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