import Chance from 'chance';

import { FailedToSaveCurrency } from '../../../util/error';
import { CurrencyRepository, CurrencyRepositoryContext } from '../currency';

import { Currency } from '../../../types/currency';

const chance = new Chance();

describe('Currency Repository', () => {
  describe('#constructor', () => {
    it('construct with all properties in context', () => {
      const fakeMysql = {
        tableName: jest.fn(),
      };

      const ctx = {
        mysqlAdapter: fakeMysql,
      } as unknown as CurrencyRepositoryContext;

      const repo = new CurrencyRepository(ctx);

      expect(repo).toBeDefined();
    });

    it('explodes to construct without context', () => {
      expect(() => {
        // eslint-disable-next-line no-new
        new CurrencyRepository({} as CurrencyRepositoryContext);
      })
        .toThrow(/Cannot set (properties|property 'tableName') of undefined/);
    });
  });

  describe('#addCurrency', () => {
    it('should save local currency and return a valid body', async () => {
      const fakeMysql = {
        tableName: jest.fn(),
        db: {
          insert: jest.fn().mockResolvedValueOnce(true),
        },
      };

      const context = {
        mysqlAdapter: fakeMysql,
      } as unknown as CurrencyRepositoryContext;

      const repo = new CurrencyRepository(context);

      const currencyToBeSaved = {
        name: chance.string({ length: 3 }),
        value: chance.floating(),
      } as Currency;

      const response = await repo.addCurrency(currencyToBeSaved);

      expect(fakeMysql.db.insert).toHaveBeenCalledWith({
        id: expect.any(String),
        name: currencyToBeSaved.name,
        value: currencyToBeSaved.value,
      });
      expect(response).toEqual({
        ...currencyToBeSaved,
        id: expect.any(String),
      });
    });

    it('should throw when mysqlAdapter throws', async () => {
      const fakeMysql = {
        tableName: jest.fn(),
        db: {
          insert: jest.fn(() => {
            throw new FailedToSaveCurrency('SQL Error');
          }),
        },
      };

      const context = {
        mysqlAdapter: fakeMysql,
      } as unknown as CurrencyRepositoryContext;

      const repo = new CurrencyRepository(context);

      const currencyToBeSaved = {
        name: chance.string({ length: 3 }),
        value: chance.floating(),
      } as Currency;

      await expect(repo.addCurrency(currencyToBeSaved)).rejects.toMatchObject({
        code: 'FAILED_TO_SAVE_CURRENCY',
        message: 'SQL Error',
      });
    });
  });

  describe('#listsCurrencies', () => {
    it('should return a valid response from database', async () => {
      const currency = {
        id: chance.guid({ version: 4 }),
        name: chance.string({ length: 3 }),
        value: chance.floating(),
        createdAt: chance.date().toISOString(),
        updatedAt: chance.date().toISOString(),
      };

      const fakeMysql = {
        tableName: jest.fn(),
        db: {
          orderBy: jest.fn().mockResolvedValue([currency]),
        },
      };

      const context = {
        mysqlAdapter: fakeMysql,
      } as unknown as CurrencyRepositoryContext;

      const repo = new CurrencyRepository(context);

      const result = await repo.listsCurrencies();

      expect(result).toEqual([currency]);
    });

    it('should throw error in find at database', async () => {
      const fakeMysql = {
        tableName: jest.fn(),
        db: {
          orderBy: jest.fn(() => {
            throw new Error('some error');
          }),
        },
      };

      const context = {
        mysqlAdapter: fakeMysql,
      } as unknown as CurrencyRepositoryContext;

      const repo = new CurrencyRepository(context);

      await expect(repo.listsCurrencies()).rejects.toThrow('some error');
      expect(fakeMysql.tableName).toBe('currency');
    });
  });
});
