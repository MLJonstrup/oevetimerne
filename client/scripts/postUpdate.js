document.addEventListener('DOMContentLoaded', () => {
    const updateForm = document.getElementById('updatePostForm');
    updateForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        //USER ID FROM COOKIE FOR LATER
        /*const userId = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('userId='))
        .split('=')[1];*/

        // Create a JavaScript object with form data
        const updatePost = {
            title: document.getElementById('updateTitle').value,
            productId: parseInt(document.getElementById('updateProductId').value),
            content: document.getElementById('updateContent').value,
            stars: parseInt(document.getElementById('updateStars').value),
            imgUrl: document.getElementById('updateImgUrl').value,
            postId: parseInt(document.getElementById('updatePostId').value),
            userId: 11
        };

        try {
            const response = await fetch('/post/updatePost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatePost),
            });
            if (response.ok) {
                console.log('Post updated successfully!');
            } 
        } catch (error) {
            console.error('An error occurred:', error);
        }
    });
});
