import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('claims', (t) => {
    t.renameColumn('claimType', 'type');
    t.renameColumn('claimStatus', 'status');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('claims', (t) => {
    t.renameColumn('type', 'claimType');
    t.renameColumn('status', 'claimStatus');
  });
}
