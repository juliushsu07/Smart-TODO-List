exports.seed = function(knex, Promise) {
  return knex('items').del()
    .then(function () {
      return Promise.all([
        knex('items').insert({
          category: 'read',
          name: "Harry Potter",
          description: 'book',
          date_added: '2017-11-22',
          date_completed: null,
          user_id: 1
        })
     ]);
   })
    .then(function () {
      return Promise.all([
        knex('items').insert({
          category: 'eat',
          name: "Wilbur Mexicana",
          description: 'restaurant',
          date_added: '2017-11-22',
          date_completed: null,
          user_id: 2
        })
     ]);
   })
    .then(function () {
      return Promise.all([
        knex('items').insert({
          category: 'watch',
          name: "Silicon Valley",
          description: 'tv show',
          date_added: '2017-11-22',
          date_completed: null,
          user_id: 2
        })
     ]);
   })
    .then(function () {
      return Promise.all([
        knex('items').insert({
          category: 'buy',
          name: "PlayStation",
          description: 'phone',
          date_added: '2017-11-22',
          date_completed: null,
          user_id: 3
        })
     ]);
   });
};
