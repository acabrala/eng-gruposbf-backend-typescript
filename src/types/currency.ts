export type Currency = {
  id?: string;
  name: string;
  value: number;
  amount?: number;
  price?: number;
};

export interface ICurrencyRepository {
  /**
   * Remove entry from Topazio direct participant
   * @param params
   */
  addCurrency(currency: Currency): Promise<Currency>;

  /**
   * Remove entry from Topazio direct participant
   * @param params
   */
  listsCurrencies(): Promise<Currency[]>;

  /**
   * Remove entry from Topazio direct participant
   * @param params
   */
  updateCurrency(currency: Partial<Currency>): Promise<Partial<Currency>>;

  getValueCurrencies(currency: Pick<Currency, 'amount'>): Promise<Currency[]>;
}

export interface ICurrencyService {
  /**
   * Remove entry from Topazio direct participant
   * @param params
   */
  addCurrency(currency: Partial<Currency>): Promise<Currency>;

  /**
   * Remove entry from Topazio direct participant
   * @param params
   */
  listsCurrencies(): Promise<Currency[]>;

  /**
   * Remove entry from Topazio direct participant
   * @param params
   */
  updateCurrency(currency: Partial<Currency>): Promise<Partial<Currency>>;

  getValueCurrencies(currency: Pick<Currency, 'amount'>): Promise<Currency[]>;
}

export interface ICurrencyUseCase {
  /**
   * Remove entry from Topazio direct participant
   * @param params
   */
  addCurrency(currency: Currency): Promise<Currency>;

  /**
   * Remove entry from Topazio direct participant
   * @param params
   */
  listsCurrencies(): Promise<Currency[]>;

  /**
   * Remove entry from Topazio direct participant
   * @param params
   */
  updateCurrency(currency: Partial<Currency>): Promise<Partial<Currency>>;

  getValueCurrencies(currency: Pick<Currency, 'amount'>): Promise<Currency[]>;
}
