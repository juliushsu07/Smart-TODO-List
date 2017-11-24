const { hash, compare } = require('bcrypt');

module.exports = function (knex) {
    let service = {};

    service.getUserByEmail = function (email) {
        return knex.select()
            .where({ email: email })
            .from('users')
            .first();
    };

    service.createUser = function (name, email, password) {
      return new Promise(function (resolve, reject) {
        service.getUserByEmail(email)
          .then(function (user) {
            console.log(user);
            if (!user) {
              return hash(password, 10);
            }
            else {
              return reject({ message: 'User with email exists' });
            }
          })
          .then(function (passwordDigest) {
            return knex('users').insert({
              name: name,
              email: email,
              password: passwordDigest
            });
          })
          .then(function () {
            return service.getUserByEmail(email);
          })
          .then(function (user) {
            return resolve(user);
          })
          .catch(function () {
            return reject({ message: 'Unable to create user' });
          });
      });
    };

    service.authenticate = function (email, password) {
      return new Promise(function (resolve, reject) {
        service.getUserByEmail(email)
        .then(function (user) {
          if (!user) {
            return reject('No user found');
          }
          compare(password, user.password)
            .then(function (equal) {
              if (equal) {
                return resolve(user);
              }
              else {
                return reject({ message: 'Password is incorrect' });
              }
            }).catch(function () {
              return reject({ message: 'Unable to authenticate' });
            });
          });
      });
    };

    return service;
};
