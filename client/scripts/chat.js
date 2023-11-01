const socket = io();

const messages = document.getElementById("messages");
const input = document.getElementById("input");

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function sendChat() {
  if (input.value) {
    socket.emit("chat message", username + ": " + input.value);
    input.value = "";
  }
}

function changeUsername() {
  username = document.getElementById("username").value;

  if (username == "") {
    alert("Skriv et nyt brugernavn");
    return;
  } else document.cookie = `userAuth=${username}`;

  socket.emit("user joined", username);
  document.getElementById("username").value = "";
}

// Socket.io

let username = getCookie("userAuth");
if (!username) location.href = "/";

socket.emit("user joined", username ? username : "Anonymous");

socket.on("chat message", (msg) => {
  const item = document.createElement("li");
  item.textContent = msg;

  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

// Hent chatbeskeder:

function seChat() {
  axios
    .get("http://161.35.86.140/store/chat")
    .then(function (response) {
      console.log(response);
      document.cookie = response.data[0];
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Server besked

function serverBesked() {
  socket.emit("hola", "Besked til server her.");
}
