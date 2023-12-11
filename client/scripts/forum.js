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

/* let currentTopicId = 0;
const topics = {};

function createTopic() {
  const topicSubjectInput = document.getElementById("topicSubject").value;
  const topicPictureInput = "path/to/picture.jpg"; //document.getElementById("topicPicture").value;

  const postElement = document.createElement("div");
  postElement.classList.add("post");
  postElement.dataset.topicId = currentTopicId;

  const topicElement = document.createElement("p");
  topicElement.textContent = topicSubjectInput;
  postElement.appendChild(topicElement);

  const pictureElement = document.createElement("img");
  pictureElement.src = topicPictureInput;
  postElement.appendChild(pictureElement);

  //Object For our topics
  topics[currentTopicId] = {
    subject: topicSubjectInput,
    comments: [],
  };

  postElement.addEventListener("click", function () {
    displayComments(this.dataset.topicId);
  });

  const forumContainer = document.getElementById("topicsList");
  forumContainer.insertBefore(postElement, forumContainer.firstChild);

  currentTopicId++;
} */

// function createTopic() {
//   const topicSubjectInput = document.getElementById("topicSubject").value;
//   const topicPictureInput = "path/to/picture.jpg"; // Skift til en rigtig sti, hvis nødvendigt

//   axios
//     .post("/forum", { subject: topicSubjectInput, picture: topicPictureInput })
//     .then((response) => {
//       console.log(response.data);
//       const postElement = document.createElement("div");
//       postElement.classList.add("post");
//       postElement.dataset.topicId = currentTopicId;

//       const topicElement = document.createElement("p");
//       topicElement.textContent = topicSubjectInput;
//       postElement.appendChild(topicElement);

//       const pictureElement = document.createElement("img");
//       pictureElement.src = topicPictureInput;
//       postElement.appendChild(pictureElement);

//       topics[currentTopicId] = {
//         subject: topicSubjectInput,
//         comments: [],
//       };

//       postElement.addEventListener("click", function () {
//         displayComments(this.dataset.topicId);
//       });

//       const forumContainer = document.getElementById("topicsList");
//       forumContainer.insertBefore(postElement, forumContainer.firstChild);

//       currentTopicId++;
//     })
//     .catch((error) => console.error("fejl", error));
// }

// function displayComments(topicId) {
//   document.getElementById("activeTopicId").value = topicId;

//   const threadHeader = document.querySelector(".threadHeader");
//   threadHeader.textContent = topics[topicId].subject;

//   const threadContent = document.getElementById("threadContent");
//   threadContent.innerHTML = "";

//   topics[topicId].comments.forEach((comment) => {
//     const commentElement = document.createElement("div");
//     commentElement.textContent = comment;
//     threadContent.appendChild(commentElement);
//   });
// }

// function addComment() {
//   const activeTopicId = document.getElementById("activeTopicId").value;
//   const commentInput = document.getElementById("commentInput").value;

//   topics[activeTopicId].comments.push(commentInput);

//   document.getElementById("commentInput").value = "";

//   displayComments(activeTopicId);
// }
