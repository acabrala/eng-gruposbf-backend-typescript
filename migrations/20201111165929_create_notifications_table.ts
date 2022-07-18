import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('notifications', (t) => {
    t.binary('id', 16).unique().primary().notNullable();
    t.binary('claimId', 16).notNullable();
    t.enum('type', ['DICT_ENTRY_CLAIM']).notNullable();
    t.enum('status', ['FAILED', 'CONFIRMED', 'WAITING_RESOLUTION', 'CANCELLED', 'COMPLETED']).notNullable();
    t.integer('attempts').nullable();
    t.timestamp('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('notifications');
}
