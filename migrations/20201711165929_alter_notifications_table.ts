import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('notifications', (t) => {
     // @ts-ignore
    t.string('notificationUrl', 100).notNullable().after('attempts');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('notifications', (t) => {
    t.dropColumn('notificationUrl');
  });
}