import * as Knex from 'knex';

export function up(knex: Knex) {
  return knex.schema.alterTable('entries', (table) => {
    table.binary('cid', 32)
      .nullable()
      .unique()
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      .after('data');
  });
}

export function down(knex: Knex) {
  return knex.schema.alterTable('entries', (table) => {
    table.dropColumn('cid');
  });
}
