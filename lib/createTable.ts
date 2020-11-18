export default function (knex) {
  knex.schema.createTable('person', function(table) {
    table.text('first_name');
    table.text('surname');
    table.text('email');
    table.text('mobile');
    table.text('gender');
    table.text('date_of_birth');
    table.text('comments');
  })
}