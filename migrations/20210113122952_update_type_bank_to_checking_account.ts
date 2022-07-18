import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex('entries').update({
    data: knex.raw('json_set(data, "$.accountType", "CHECKING_ACCOUNT")'),
  }).whereRaw('data->"$.accountType" = ?', ['CURRENT_ACCOUNT']);
}

export async function down(knex: Knex): Promise<any> {
  return knex('entries').update({
    data: knex.raw('json_set(data, "$.accountType", "CURRENT_ACCOUNT")'),
  }).whereRaw('data->"$.accountType" = ?', ['CHECKING_ACCOUNT']);
}
