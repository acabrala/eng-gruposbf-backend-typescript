import Chance from 'chance';

import { CurrencyUseCase } from '../currency';

import { UseCaseContext } from '../../../types/core';
import { Currency } from '../../../types/currency';

const chance = new Chance();

describe('Currency Use Case', () => {
  describe('#constructor', () => {
    it('explodes with undefined UseCaseContext', () => {
      try {
        const uc = new CurrencyUseCase(undefined as unknown as UseCaseContext);
        expect(uc).toBeUndefined();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('name', 'TypeError');
        expect(error.message).toContain('currencyService\' of undefined');
      }
    });

    it('constructs with an empty UseCaseContext object', () => {
      const uc = new CurrencyUseCase({} as UseCaseContext);
      expect(uc).toBeInstanceOf(CurrencyUseCase);
      expect(uc).toHaveProperty('addCurrency');
    });
  });

  describe('#addCurrency', () => {
    it('should return a valid body', async () => {
      const params = {
        value: chance.integer({ min: 1, max: 2 }),
        name: chance.string({ length: 3 }),
      };

      const ctx = {
        currencyService: {
          addCurrency: jest.fn().mockResolvedValue(params),
        },
      } as unknown as UseCaseContext;

      const currencyUseCase = new CurrencyUseCase(ctx);

      const result = await currencyUseCase.addCurrency(params);

      expect(result).toEqual(params);
    });

    it('throw an unexpected error at service', async () => {
      const params = {
        value: chance.integer({ min: 1, max: 2 }),
        name: chance.string({ length: 3 }),
      };

      const ctx = {
        currencyService: {
          addCurrency: jest
            .fn()
            .mockRejectedValueOnce(new Error('Some error')),
        },
      } as unknown as UseCaseContext;

      const uc = new CurrencyUseCase(ctx);

      await expect(uc.addCurrency(params)).rejects.toThrow('Unexpected error to create a currency');
    });

    it('throw error with invalid properties', async () => {
      const params = {
        name: 'EUR',
      } as unknown as Currency;

      const ctx = {
        currencyService: {
          addCurrency: jest.fn(),
        },
      } as unknown as UseCaseContext;

      const currencyUseCase = new CurrencyUseCase(ctx);

      expect(currencyUseCase.addCurrency(params)).rejects.toThrow('Invalid properties to create claim');
    });
  });

  describe('#listsCurrencies', () => {
    it('should return a currency', async () => {
      const response = [{
        name: chance.string({ length: 3 }),
        value: 5.17,
        id: chance.guid({ version: 4 }),
      }, {
        name: chance.string({ length: 3 }),
        value: chance.floating(),
        id: chance.guid({ version: 4 }),
      }];
      const ctx = {
        currencyService: {
          listsCurrencies: jest.fn().mockResolvedValue(response),
        },
      } as unknown as UseCaseContext;

      const currencyUseCase = new CurrencyUseCase(ctx);

      const result = await currencyUseCase.listsCurrencies();

      expect(result).toEqual(response);
    });

    it('throw an unexpected error at service', async () => {
      const ctx = {
        currencyService: {
          listsCurrencies: jest
            .fn()
            .mockRejectedValueOnce(new Error('Some error')),
        },
      } as unknown as UseCaseContext;

      const uc = new CurrencyUseCase(ctx);

      await expect(uc.listsCurrencies()).rejects.toThrow('Unexpected error to get currencys');
    });
  });

  describe('#updateCurrency', () => {
    it('should return a valid body', async () => {
      const params = {
        value: chance.integer({ min: 1, max: 2 }),
        id: chance.guid({ version: 4 }),
      };

      const ctx = {
        currencyService: {
          updateCurrency: jest.fn().mockResolvedValue(params),
        },
      } as unknown as UseCaseContext;

      const currencyUseCase = new CurrencyUseCase(ctx);

      const result = await currencyUseCase.updateCurrency(params);

      expect(result).toEqual(params);
    });

    it('throw an unexpected error at service', async () => {
      const params = {
        value: chance.integer({ min: 1, max: 2 }),
        name: chance.string({ length: 3 }),
      };

      const ctx = {
        currencyService: {
          updateCurrency: jest
            .fn()
            .mockRejectedValueOnce(new Error('Some error')),
        },
      } as unknown as UseCaseContext;

      const uc = new CurrencyUseCase(ctx);

      await expect(uc.updateCurrency(params)).rejects.toThrow('Unexpected error to update currency');
    });

    it('throw error with invalid properties', async () => {
      const params = {
        name: 'EUR',
      } as unknown as Currency;

      const ctx = {
        currencyService: {
          updateCurrency: jest.fn(),
        },
      } as unknown as UseCaseContext;

      const currencyUseCase = new CurrencyUseCase(ctx);

      expect(currencyUseCase.updateCurrency(params)).rejects.toThrow('Invalid properties to update claim');
    });
  });

  describe('#getValueCurrencies', () => {
    it('should return a valid body', async () => {
      const params = {
        amount: chance.floating(),
      };

      const responseFromUseCase = [{
        price: chance.floating(),
        name: chance.string({ length: 3 }),
      }];

      const ctx = {
        currencyService: {
          getValueCurrencies: jest.fn().mockResolvedValue(responseFromUseCase),
        },
      } as unknown as UseCaseContext;

      const currencyUseCase = new CurrencyUseCase(ctx);

      const result = await currencyUseCase.getValueCurrencies(params);

      expect(result).toEqual(responseFromUseCase);
    });

    it('throw an unexpected error at service', async () => {
      const params = {
        amount: chance.integer({ min: 1, max: 2 }),
      };

      const ctx = {
        currencyService: {
          getValueCurrencies: jest
            .fn()
            .mockRejectedValueOnce(new Error('Some error')),
        },
      } as unknown as UseCaseContext;

      const uc = new CurrencyUseCase(ctx);

      await expect(uc.getValueCurrencies(params)).rejects.toThrow('Unexpected error to get value in currencys');
    });

    it('throw error with invalid properties', async () => {
      const params = {
        name: 'EUR',
      } as unknown as Currency;

      const ctx = {
        currencyService: {
          getValueCurrencies: jest.fn(),
        },
      } as unknown as UseCaseContext;

      const currencyUseCase = new CurrencyUseCase(ctx);

      expect(currencyUseCase.getValueCurrencies(params)).rejects.toThrow('Invalid properties to get value currencys');
    });
  });
});
