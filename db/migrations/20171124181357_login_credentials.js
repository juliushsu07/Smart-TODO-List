
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table){
    table.string('email');
    table.string('password');

    //SHOULD MAYBE BE:
        // table.string('email').unique().notNullable();
        // table.string('password_digest').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table){
    table.dropColumn('email');
    table.dropColumn('password');
  });
};
