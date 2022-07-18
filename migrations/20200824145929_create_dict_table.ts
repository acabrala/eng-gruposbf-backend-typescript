import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('dict', (t) => {
    t.binary('id', 16).unique().primary().notNullable();
    t.enum('keyType', ['CPF', 'CNPJ', 'PHONE', 'EMAIL', 'EVP']).notNullable();
    t.string('keyValue', 255).notNullable();
    t.json('data').notNullable();
    t.timestamp('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    t.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('dict');
}
