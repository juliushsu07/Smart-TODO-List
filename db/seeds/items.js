exports.seed = function(knex, Promise) {
  return knex('items').del()
    .then(function () {
      return Promise.all([
        knex('items').insert({
          id: 1,
          category: 'read',
          name: "Harry Potter",
          description: 'book',
          date_added: '2017-11-22',
          date_completed: null,
          user_id: 1
        })
      ]);
    });
};
