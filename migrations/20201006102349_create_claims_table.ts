import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('claims', (t) => {
    t.binary('id', 16).unique().primary().notNullable();
    t.binary('claimId', 16).notNullable();
    t.binary('entryId', 16).references('id').inTable('entries').onDelete('SET NULL');
    t.enum('claimType', ['PORTABILITY', 'OWNERSHIP']).notNullable();
    t.enum('claimStatus', ['OPEN', 'WAITING_RESOLUTION', 'CONFIRMED', 'CANCELLED']).notNullable().defaultTo('OPEN');
    t.json('info').notNullable().comment('Objeto JSON contendo "key", "accountInfo", "person" e "idempotencyKey"');
    t.timestamp('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('claims');
}
