import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('entries', (t) => {
    t.enum('keyStatus', [
      'INACTIVE',
      'OWNERSHIP_IN_PROGRESS',
      'PORTABILITY_IN_PROGRESS',
      'ACTIVE',
      'FRAUD',
    ]).notNullable()
      .defaultTo('INACTIVE')
      .alter();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('entries', (t) => {
    t.enum('keyStatus', [
      'INACTIVE',
      'OWNERSHIP_IN_PROGRESS',
      'PORTABILITY_IN_PROGRESS',
      'ACTIVE',
    ]).notNullable()
      .defaultTo('INACTIVE')
      .alter();
  });
}
