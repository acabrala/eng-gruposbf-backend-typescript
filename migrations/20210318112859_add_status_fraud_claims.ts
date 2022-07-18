import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('claims', (table) => {
    table.enum('status', [
      'PENDING',
      'OPEN',
      'WAITING_RESOLUTION',
      'CONFIRMED',
      'COMPLETED',
      'CANCELLED',
      'FAILED',
      'FRAUD',
    ]).notNullable().defaultTo('PENDING').alter();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('claims', (t) => {
    t.enum('status', [
      'PENDING',
      'OPEN',
      'WAITING_RESOLUTION',
      'CONFIRMED',
      'COMPLETED',
      'CANCELLED',
      'FAILED',
    ]).notNullable().defaultTo('PENDING').alter();
  });
}
