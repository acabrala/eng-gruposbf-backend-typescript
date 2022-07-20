/* eslint-disable no-return-await */
import { addCurrencySchema, updateCurrencySchema, getValueCurrencieschema } from './schemas/currency';
import { validateProperties } from './schemas/shared';

import { UseCaseContext } from '../../types/core';
import { ICurrencyUseCase, Currency } from '../../types/currency';

export class CurrencyUseCase implements ICurrencyUseCase {
  private currencyService: UseCaseContext['currencyService'];

  constructor(ctx: UseCaseContext) {
    this.currencyService = ctx.currencyService;
  }

  async addCurrency(currency: Currency): Promise<Currency> {
    try {
      validateProperties({
        schema: addCurrencySchema,
        params: currency,
        errorMsg: 'Invalid properties to create a currency',
      });

      const createdCurrency = await this.currencyService.addCurrency(currency);
      return createdCurrency;
    } catch (err) {
      throw new Error(
        'Unexpected error to create a currency',
      );
    }
  }

  async listsCurrencies(): Promise<Currency[]> {
    try {
      const currencys = await this.currencyService.listsCurrencies();
      return currencys;
    } catch (err) {
      throw new Error(
        'Unexpected error to get currencys',
      );
    }
  }

  async updateCurrency(currency: Partial<Currency>): Promise<Partial<Currency>> {
    try {
      validateProperties({
        schema: updateCurrencySchema,
        params: currency,
        errorMsg: 'Invalid properties to update claim',
      });

      const updatedCurrency = await this.currencyService.updateCurrency(currency);
      return updatedCurrency;
    } catch (err) {
      throw new Error(
        'Unexpected error to update currency',
      );
    }
  }

  async getValueCurrencies(currency: Pick<Currency, 'amount'>): Promise<Currency[]> {
    try {
      validateProperties({
        schema: getValueCurrencieschema,
        params: currency,
        errorMsg: 'Invalid properties to get value currencys',
      });

      const valueInCurrencys = await this.currencyService.getValueCurrencies(currency);
      return valueInCurrencys;
    } catch (err) {
      throw new Error(
        'Unexpected error to get value in currencys',
      );
    }
  }
}
