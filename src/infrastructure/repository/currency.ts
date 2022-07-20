import * as Uuid from '@somosphi/uuid';

import { FailedToFindCurrency } from '../../util/error';

import { ICurrencyRepository, Currency } from '../../types/currency';
import {
  IMysqlAdapter,
  ContainerConfig,
} from '../../types/infrastructure';

export type CurrencyRepositoryContext = {
  config: ContainerConfig;
  mysqlAdapter: IMysqlAdapter;
};

export class CurrencyRepository implements ICurrencyRepository {
  private mysqlAdapter: IMysqlAdapter;

  constructor({ mysqlAdapter }: CurrencyRepositoryContext) {
    // eslint-disable-next-line new-cap
    this.mysqlAdapter = mysqlAdapter;
    this.mysqlAdapter.tableName = 'currency';
  }

  async addCurrency(currency: Currency): Promise<Currency> {
    const id = Uuid.generate();

    await this.mysqlAdapter.db.insert({
      id,
      value: currency.value,
      name: currency.name,
    });

    return {
      id,
      name: currency.name,
      value: currency.value,
    };
  }

  // eslint-disable-next-line consistent-return
  async listsCurrencies(): Promise<Currency[] > {
    const transactions = await this.mysqlAdapter.db
      .orderBy('createdAt', 'asc')
      .catch((err) => {
        throw new FailedToFindCurrency('error');
      });

    return transactions;
  }

  async updateCurrency(currency: Partial<Currency>): Promise<Partial<Currency>> {
    await this.mysqlAdapter.db.where({ id: currency.id }).update({ value: currency.value });
    return {
      id: currency.id,
      value: currency.value!,
    };
  }

  async getValueCurrencies(currency: Pick<Currency, 'amount'>): Promise<Currency[]> {
    const currencys = await this.mysqlAdapter.db.orderBy('createdAt', 'asc');
    return currencys.map((item: Currency) => ({
      name: item.name,
      price: currency.amount! / item.value,
    }));
  }
}
