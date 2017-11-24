/*jshint esversion: 6 */
"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const bcrypt      = require("bcrypt");
const session     = require("cookie-session");
const flash       = require("connect-flash");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');


// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const itemsRoutes = require("./routes/items");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
    name: 'session',
    keys: 'idntknw'
}));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));

//set up services:
const userService = require("./lib/userService")(knex);

//Mount public routes:
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
app.use("/api/items", itemsRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Login page
app.get("/login", (req,res) => {
  res.render("login", {
    errors: req.flash('errors'),
    info: req.flash('info'),
    user: req.session.user_email
  });
});
app.post("/signup", (req,res) => {
  let {name, email, password} = req.body;

  userService.createUser(name, email, password)
    .then(function(user) {
      req.session.user_email = user.email;
      res.redirect("/");
    })
    .catch(function(err){
      req.flash('errors', err.message);
      res.render('login', {
        errors: req.flash('errors'),
        info: req.flash('info'),
        user: {}
      });
    });
});
app.post('/signin', function (req, res) {
  const { email, password } = req.body;

  userService.authenticate(email, password)
    .then(function (user) {
      req.session.user_email = user.email;
      res.redirect("/");
    })
    .catch(function (err) {
      req.flash('errors', err.message);
      res.render('login', {
        errors: req.flash('errors'),
        info: req.flash('info'),
        user: {}
      });
    });
});



//list page
app.get("/completed", (req, res) => {
  let completedItems = [];
  knex
    .select("*")
    .from("items")
    .then((results) => {
      results.forEach(function(result, i) {
        if (result.date_completed !== null) {
          completedItems.push({
            name: result.name,
            date: result.date_completed,
            category: result.category
          })
        }
      })
      res.render("completed_list", {completedItems: completedItems} );
    })
    .catch(err => res.send(err));
});

app.get("/:id", (req, res) => {
  if (["read", "eat", "buy", "watch"].includes(req.params.id)) {
    res.render("item", { category: req.params.id })
  } else {
    res.status(404).send("The list you are looking for does not exist! ");
  }
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});



