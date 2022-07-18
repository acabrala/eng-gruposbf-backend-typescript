import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.alterTable('claims', (t) => {
    t.json('info')
      .notNullable()
      .comment('Objeto JSON contendo "key", "accountInfo", "accountInfoKey", "person", "statusMessage", "correlationId", "requestId" e "player"')
      .alter();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('claims', (t) => {
    t.json('info')
      .notNullable()
      .comment('Objeto JSON contendo "key", "accountInfo", "person", "statusMessage" e "correlationId"')
      .alter();
  });
}
