
import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('claims', (t) => {
    t.enum('status', [
      'PENDING',
      'OPEN',
      'WAITING_RESOLUTION',
      'CONFIRMED',
      'CANCELLED',
      'FAILED',
    ]).notNullable().defaultTo('PENDING').alter();
    t.json('info').notNullable().comment('Objeto JSON contendo "key", "accountInfo", "person", "statusMessage" e "correlationId"').alter();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('claims', (t) => {
    t.enum('status', ['OPEN', 'WAITING_RESOLUTION', 'CONFIRMED', 'CANCELLED']).notNullable().defaultTo('OPEN').alter();
    t.json('info').notNullable().comment('Objeto JSON contendo "key", "accountInfo", "person" e "idempotencyKey"').alter();
  });
}
