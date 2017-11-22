exports.up = function(knex, Promise) {
  return knex.schema.createTable('items', function (table) {
    table.increments();
    table.string('category');
    table.string('name');
    table.string('description');
    table.date('date_added');
    table.date('date_completed');
    table.string('user_id');
  });
};

exports.down = function(knex, Promise) {
   return knex.schema.dropTable('items');
};
