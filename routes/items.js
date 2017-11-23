"use strict";

const express = require('express');
const router = express.Router();
const googleAPI = require('../api/google.js');
const yelpAPI = require('../api/yelp.js');


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
    let date = new Date();
    googleAPI(req.body.name, function(err, category, description){
      if (err){
        res.send('500: error automatically categorizing');
      }
      knex('items').insert([{
          category: category,
          name: req.body.name,
          description: description,
          date_added: date.toISOString().substr(0, 10),
          user_id: 1
        }])
        .then(res.redirect('/'))
        .catch(err => res.send(err));
    });
  });



  router.get('/:name', (req, res) => {
    yelpAPI(req.params.name, (jsonres) => {
      res.send(jsonres)
    })
  })




  router.post("/:name", (req, res) => {
    console.log("deleted", req.params.name);
    knex('items')
      .where('name', req.params.name)
      .delete()
      .then(res.redirect("/"))
      .catch(err => res.send(err));
  })

  return router;
};


