import * as Knex from 'knex';

export async function up(knex: Knex): Promise<unknown> {
  return knex.schema.renameTable('dict', 'entries');
}

export async function down(knex: Knex): Promise<unknown> {
  return knex.schema.renameTable('entries', 'dict');
}
