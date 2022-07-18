import * as Knex from 'knex';

import { BankAccountType } from '../src/types/message';

const TABLE_NAME = 'entries';

export async function up(knex: Knex): Promise<any> {
  return knex(TABLE_NAME)
    .update({
      data: knex.raw(`
        JSON_SET(data, '$.accountType', '${BankAccountType.PAYMENT_ACCOUNT}')
      `),
    });
}

export async function down(knex: Knex): Promise<any> {
  return knex(TABLE_NAME)
    .update({
      data: knex.raw(`
        JSON_SET(data, '$.accountType', '${BankAccountType.CHECKING_ACCOUNT}')
      `),
    });
}
