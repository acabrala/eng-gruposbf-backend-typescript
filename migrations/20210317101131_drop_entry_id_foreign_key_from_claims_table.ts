import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.table('claims', (table) => {
    table.dropForeign(['entryId'], 'claims_entryid_foreign');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.table('claims', (table) => {
    table.foreign('entryId').references('entries.id');
  });
}
