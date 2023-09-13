const express = require("express");
const customerRoutes = express.Router();

const customers = require("../db/customers");

customerRoutes.get("/", (req, res) => {
  res.send(customers);
});

customerRoutes.post("/", (req, res) => {
    res.post(customers);
  }
)

module.exports = customerRoutes;
