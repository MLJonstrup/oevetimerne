const express = require("express");
const forumRoutes = express.Router();

let topics = [];

forumRoutes.post("/", (req, res) => {
  const newTopic = req.body;

  // Valider data
  if (!newTopic.subject || !newTopic.picture) {
    return res.status(400).send("Emne og billede er påkrævet.");
  }

  topics.push(newTopic);

  res.status(200).send("Nyt forum emne oprettet");
});

forumRoutes.get("/", (req, res) => {
  res.status(200).json(topics);
});

module.exports = forumRoutes;
