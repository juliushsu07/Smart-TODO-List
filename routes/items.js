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

  router.get("/", (req, res) => {
    getIDFromEmail(req.session.user_email, id => {
      knex
      .select()
      .from("items")
      .where({user_id: id})
      .orderBy('date_completed')
      .then((results) => {
        res.json(results);
      })
      .catch(err => res.send(err));
    });
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

  function getIDFromEmail(email, callback){
    knex('users')
      .select('id')
      .where({email: email})
      .then( (result)=>{
        callback(result[0].id);
      });
  }


  router.post("/", (req, res) => {
    getIDFromEmail(req.session.user_email, id => {
      let date = new Date();
      googleAPI(req.body.name, function(err, category, description){
        if (err){
          res.send('500: error automatically categorizing');
        }
        knex('items').insert([{
            category: category,
            name: req.body.name,
            description: description,
            date_added: date.toISOString(),
            user_id: id
          }])
          .then(res.send({category: category}))
          .catch(err => res.send(err));
      });
    });
  });

  router.put('/:id/:complete', (req, res) => {
    if (req.params.complete == 'true'){
      knex('items')
      .where('id', req.params.id)
      .update({date_completed: new Date().toISOString()})
      .then(() => {
        res.json({success: true});
      })
      .catch(err => res.send(err));
    } else {
      knex('items')
      .where('id', req.params.id)
      .update({date_completed: null })
      .then(() => {
        res.json({success: true});
      })
      .catch(err => res.send(err));
    }
  });


  router.delete("/:id", (req, res) => {
    knex('items')
      .where('id', req.params.id)
      .delete()
      .then(() => {
        res.json({success: true});
      })
      .catch(err => res.send(err));
  });

  router.get('/eat/:name', (req, res) => {
    yelpAPI(req.params.name, (jsonres) => {
      res.send(jsonres);
    });
  });


  router.get('/watch/:name', (req, res) => {
    omdbAPI(req.params.name, (jsonres) => {
      res.send(jsonres);
    });
  });

  router.get('/read/:name', (req, res) => {
    goodreadsAPI(req.params.name, (err, jsonres) => {
      res.send(jsonres);
    });
  });

  router.get('/buy/:name', (req, res) => {
    amazonAPI(req.params.name, (err, jsonres) => {
      console.log("WHAT WE GET BACK", JSON.stringify(err), jsonres);
      res.send(jsonres);
    });
  });

  router.put('/:id/update/category', (req, res) => {
      knex('items')
      .where('id', req.params.id)
      .update({category: req.body.category })
      .then(() => {
        res.json({success: true});
      })
      .catch(err => res.send(err));
  });

  return router;
};


