"use strict";

const express = require('express');
const router  = express.Router();

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
  knex('items').insert([req.body])
  .then(res.redirect('/'))
  .catch(err => res.send(err));

})
  return router;
}
