import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('postbacks', (t) => {
    t.binary('id', 16).unique().primary().notNullable();
    t.string('client', 60).notNullable();
    t.string('ispb', 8).notNullable();
    t.string('digits', 2).unique();
    t.string('notificationUrl', 100).notNullable();
    t.timestamp('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('postbacks');
}
