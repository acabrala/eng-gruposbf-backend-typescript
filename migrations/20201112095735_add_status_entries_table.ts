import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('entries', (t) => {
    t.enum('keyStatus', [
      'INACTIVE',
      'OWNERSHIP_IN_PROGRESS',
      'PORTABILITY_IN_PROGRESS',
      'ACTIVE',
    ]).notNullable()
      .defaultTo('INACTIVE')
      // @ts-ignore
      .after('keyValue');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('entries', (t) => {
    t.dropColumn('keyStatus');
  });
}
