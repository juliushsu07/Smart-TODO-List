"use strict";

const express = require('express');
const router = express.Router();
const googleAPI = require('../api/google.js');
const yelpAPI = require('../api/yelp.js');
const omdbAPI = require('../api/omdb.js');
const goodreadsAPI = require('../api/goodreads.js');
const amazonAPI = require('../api/amazon.js');



module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("items")
      .where({date_completed : null})
      .then((results) => {
        res.json(results);
      })
      .catch(err => res.send(err));
  });

   router.get("/completed", (req, res) => {
    knex
      .select("*")
      .from("items")
      .whereNotNull("date_completed")
      .then((results) => {
        res.json(results);
      })
      .catch(err => res.send(err));
  });


  router.post("/", (req, res) => {
    let date = new Date();
    console.log(req.body);
    debugger;
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

  router.put('/:name', (req, res) => {
      knex('items')
      .where('name', req.params.name)
      .update({date_completed: new Date().toISOString() })
      .then(() => {
        res.json({success: true})
      })
      .catch(err => res.send(err));
  });


  router.delete("/:name", (req, res) => {
    console.log("deleted", req.params.name);
    knex('items')
      .where('name', req.params.name)
      .delete()
      .then(() => {
        res.json({success: true})
      })
      .catch(err => res.send(err));
  });

  router.get('/eat/:name', (req, res) => {
    yelpAPI(req.params.name, (jsonres) => {
      res.send(jsonres)
    });
  });


  router.get('/watch/:name', (req, res) => {
    omdbAPI(req.params.name, (jsonres) => {
      res.send(jsonres)
    })
  })

  router.get('/read/:name', (req, res) => {
    goodreadsAPI(req.params.name, (err, jsonres) => {
      res.send(jsonres)
    })
  })

  router.get('/buy/:name', (req, res) => {
    amazonAPI(req.params.name, (err, jsonres) => {
      console.log("WHAT WE GET BACK", JSON.stringify(err), jsonres);
      res.send(jsonres)
    })
  })

  router.put('/:name/update/category', (req, res) => {
      knex('items')
      .where('name', req.params.name)
      .update({category: req.body.category })
      .then(() => {
        res.json({success: true})
      })
      .catch(err => res.send(err));
  });

  return router;
};


