const express = require("express");
const customerRoutes = express.Router();

const customers = require("../db/customers");

customerRoutes.get("/", (req, res) => {
  res.send(customers);
});

customerRoutes.post("/", (req, res) => {
    const newCustomer = req.body
    customers.push(newCustomers);
    res.status(201).send(newCustomer)
  }
)

customerRoutes.delete("/id", (req, res) => {
  const un = req.params.username
  const index = customers.findIndex(
    customer => customer.un === un
    )
  customers.splice(index, 1)
  res.status(200).send(customers)
})

module.exports = customerRoutes;
