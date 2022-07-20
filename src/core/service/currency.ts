import R from 'ramda';

import { ServiceContext } from '../../types/core';
import { ICurrencyService, Currency } from '../../types/currency';

export class CurrencyService implements ICurrencyService {
  private currencyRepository: ServiceContext['currencyRepository'];

  constructor(context: ServiceContext) {
    this.currencyRepository = context.currencyRepository;
  }

  public async addCurrency(currency: Currency): Promise<Currency> {
    return this.currencyRepository.addCurrency(currency);
  }

  // eslint-disable-next-line class-methods-use-this
  public async listsCurrencies(): Promise<Currency[]> {
    return this.currencyRepository.listsCurrencies();
  }

  public async updateCurrency(currency: Partial<Currency>): Promise<Partial<Currency>> {
    return this.currencyRepository.updateCurrency(currency);
  }

  public async getValueCurrencies(currency: Pick<Currency, 'amount'>): Promise<Currency[]> {
    return this.currencyRepository.getValueCurrencies(currency);
  }
}
