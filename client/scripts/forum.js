
//kode under inspiretet fra følgene side: https://www.freecodecamp.org/news/javascript-fetch-api-tutorial-with-js-fetch-post-and-header-examples/ og https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript
// Vent, indtil DOM'en er fuldt indlæst, før koden udføres
document.addEventListener("DOMContentLoaded", async () => {
  // Forsøg at hente brugeroplysninger med en GET-anmodning
  try {
    const response = await axios.get("/user/details", {
      withCredentials: true,
    });

    const user = response.data;
    console.log("User details:", user);
    var userId = user.userId;
  } catch (error) {
     // Håndter eventuelle fejl ved at logge dem
    if (error.response && error.response.status === 401) {
      console.log("User is not authenticated");
    } else {
      console.error("Error fetching user details:", error.message);
    }
  }
  console.log(userId);// Log brugerens ID til konsolle
  
  // Funktion til at hente brugerens poster og vise dem på siden
  async function fetchUserPosts() {
    try {
      // Udfør en GET-anmodning for at hente brugerens poster
      const response = await fetch("/post/posts"); 
      if (response.ok) {
        const posts = await response.json();// Gem poster som JSON-data
        const postsContainer = document.getElementById("topics"); // Hent containeren til poster

        // Iterer gennem hver post i arrayet
        posts.forEach((post) => {

          // Opret elementer for titel, dato, indhold og billede
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

          // Tilføj en eventlistener til at vise kommentarer ved klik
          postDiv.addEventListener("click", () =>
            fetchAndDisplayComments(post.id)
          );
          // Tilføj postDiv til postsContainer
          postsContainer.appendChild(postDiv);
        });
      } else {
        console.error("Failed to fetch user posts:", response.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  // Funktion til at hente og vise kommentarer for en bestemt post
  async function fetchAndDisplayComments(postId) {
    try {
        const response = await fetch(`/comments/post/${postId}`);
        if (response.ok) {
        const comments = await response.json();
        console.log(comments);
        const threadContainer = document.getElementById("thread");
       // Ryd eksisterende indhold i threadContainer
        threadContainer.innerHTML = "";

        // Tilføj en overskrift til kommentarsektionen
        const threadHeading = document.createElement("h2");
        threadHeading.textContent = "Thread";
        threadContainer.appendChild(threadHeading);

        // Iterer gennem hver kommentar og vis dem
        comments.forEach((comment) => {
          const commentDiv = document.createElement("div");
          commentDiv.textContent = `${comment.username}: ${comment.commentsContent}`;
          commentDiv.classList.add("comment");
          threadContainer.appendChild(commentDiv);
        });

        // Opret et tekstområde til at indtaste kommentarer
        const commentText = document.createElement("textarea");
        commentText.id = "commentText";
        commentText.placeholder = "Enter your comment";
        threadContainer.appendChild(commentText);

        // Opret en knap til at tilføje kommentarer
        const addCommentBtn = document.createElement("button");
        addCommentBtn.id = "addCommentBtn";
        addCommentBtn.textContent = "Add Comment";
        threadContainer.appendChild(addCommentBtn);

        // Eventlistener til at tilføje kommentarer
        addCommentBtn.addEventListener("click", async () => {
            const commentContent = commentText.value.trim();

            // Tjek om kommentaren ikke er tom
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
                    // Tilføj den nye kommentar til tråden
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
// Kald fetchUserPosts for at hente og vise brugerens poster
  fetchUserPosts();
});