"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("items")
      .then((results) => {
        res.json(results);
      });
  });


  router.post("/", (req, res) => {
    let date = new Date()
    knex('items').insert([{
        category: req.body.category,
        name: req.body.name,
        description: req.body.description,
        date_added: date.toISOString().substr(0, 10),
        user_id: req.body.user_id
      }])
      .then(res.redirect('/'))
      .catch(err => res.send(err));

  })


  router.post("/:id", (req, res) => {
    console.log("deleted", req.params.id);
    knex('items')
      .where('name', req.params.id)
      .delete()
      .then(res.redirect("/"))
      .catch(err => res.send(err));
  })





  return router;
}
