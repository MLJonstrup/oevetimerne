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

function createTopic() {
  const topicSubjectInput = document.getElementById("topicSubject").value;
  const topicPictureInput = "path/to/picture.jpg"; // Skift til en rigtig sti, hvis nødvendigt

  axios
    .post("/forum", { subject: topicSubjectInput, picture: topicPictureInput })
    .then((response) => {
      console.log(response.data);
      const postElement = document.createElement("div");
      postElement.classList.add("post");
      postElement.dataset.topicId = currentTopicId;

      const topicElement = document.createElement("p");
      topicElement.textContent = topicSubjectInput;
      postElement.appendChild(topicElement);

      const pictureElement = document.createElement("img");
      pictureElement.src = topicPictureInput;
      postElement.appendChild(pictureElement);

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
    })
    .catch((error) => console.error("fejl", error));
}

function displayComments(topicId) {
  document.getElementById("activeTopicId").value = topicId;

  const threadHeader = document.querySelector(".threadHeader");
  threadHeader.textContent = topics[topicId].subject;

  const threadContent = document.getElementById("threadContent");
  threadContent.innerHTML = "";

  topics[topicId].comments.forEach((comment) => {
    const commentElement = document.createElement("div");
    commentElement.textContent = comment;
    threadContent.appendChild(commentElement);
  });
}

function addComment() {
  const activeTopicId = document.getElementById("activeTopicId").value;
  const commentInput = document.getElementById("commentInput").value;

  topics[activeTopicId].comments.push(commentInput);

  document.getElementById("commentInput").value = "";

  displayComments(activeTopicId);
}
