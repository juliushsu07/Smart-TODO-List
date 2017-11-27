/*jshint esversion: 6*/
"use strict";

const express = require('express');
const router = express.Router();
const googleAPI = require('../api/google.js');
const yelpAPI = require('../api/yelp.js');
const omdbAPI = require('../api/omdb.js');
const goodreadsAPI = require('../api/goodreads.js');
const amazonAPI = require('../api/amazon.js');


module.exports = (knex) => {

  //send back all items for a given user
  router.get("/", (req, res) => {
    getIDFromEmail(req.session.user_email, id => {
      knex
      .select()
      .from("items")
      .where({user_id: id})
      .orderBy('date_completed', 'desc')
      .orderBy('date_added', 'desc')
      .then((results) => {
        res.json(results);
      })
      .catch(err => res.send(err));
    });
  });

  //send back all completed items for a given user
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

  //db call to get user_id
  function getIDFromEmail(email, callback) {
    knex('users')
      .select('id')
      .where({ email: email })
      .then((result) => {
        callback(result[0].id);
      });
  }

  //recieving new item to add to databas
  router.post("/", (req, res) => {
    getIDFromEmail(req.session.user_email, id => {
      let date = new Date();
      googleAPI(req.body.name, function(err, category, description) {
        if (err) {
          res.send('500: error automatically categorizing');
          return;
        }
        knex('items').insert([{
            category: category,
            name: req.body.name,
            description: description,
            date_added: date.toISOString(),
            user_id: id
          }])
          .then(res.send({ category: category }))
          .catch(err => res.send(err));
      });
    });
  });

  //check off that item has been completed in the database
  router.put('/:id/:complete', (req, res) => {
    if (req.params.complete == 'true') {
      knex('items')
        .where('id', req.params.id)
        .update({ date_completed: new Date().toISOString() })
        .then(() => {
          res.json({ success: true });
        })
        .catch(err => res.send(err));
    } else {
      knex('items')
        .where('id', req.params.id)
        .update({ date_completed: null })
        .then(() => {
          res.json({ success: true });
        })
        .catch(err => res.send(err));
    }
  });

  //delete item from db
  router.delete("/:id", (req, res) => {
    knex('items')
      .where('id', req.params.id)
      .delete()
      .then(() => {
        res.json({ success: true });
      })
      .catch(err => res.send(err));
  });

  //handle yelp api calls
  router.get('/eat/:name', (req, res) => {
    yelpAPI(req.params.name, (jsonres) => {
      res.send(jsonres);
    });
  });

  //handle omdb api calls
  router.get('/watch/:name', (req, res) => {
    omdbAPI(req.params.name, (jsonres) => {
      res.send(jsonres);
    });
  });

  //handle goodreads api calls
  router.get('/read/:name', (req, res) => {
    goodreadsAPI(req.params.name, (err, jsonres) => {
      res.send(jsonres);
    });
  });

  //handle amazon api calls
  router.get('/buy/:name', (req, res) => {
    amazonAPI(req.params.name, (err, jsonres) => {
      console.log("WHAT WE GET BACK", JSON.stringify(err), jsonres);
      res.send(jsonres);
    });
  });

  //update the category of an item in the database
  router.put('/:id/update/category', (req, res) => {
    knex('items')
      .where('id', req.params.id)
      .update({ category: req.body.category })
      .then(() => {
        res.json({ success: true });
      })
      .catch(err => res.send(err));
  });

  return router;
};
