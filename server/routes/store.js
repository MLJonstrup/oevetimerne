const express = require("express");
const storeRoutes = express.Router();

const chatLog = require("../db/chat");

const cookieParser = require("cookie-parser");
storeRoutes.use(cookieParser());

storeRoutes.get("/chat", (req, res) => {
  res.send(chatLog);
});

storeRoutes.post("/checkout", (req, res) => {
  console.log(req.body.bag);
  console.log(req.cookies);

  const bag = req.cookies.bagItems;
  const bagSplit = bag.split(",");

  bagSplit.forEach((item) => {
    console.log(item);
  });

  console.log(bagSplit);

  res.status(201).json({});
});

module.exports = storeRoutes;
