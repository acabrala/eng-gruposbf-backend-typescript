import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('credentials', (t) => {
    t.binary('id', 16).unique().primary().notNullable();
    t.string('ispb', 8).unique().notNullable().comment('Número de 8 caracteres, único por instituição');
    t.json('data').notNullable()
      .comment('Objeto JSON contendo "directParticipant", "clientId" e "clientSecret"');
    t.timestamp('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    t.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('credentials');
}
