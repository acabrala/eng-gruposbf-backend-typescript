import Chance from 'chance';

import { CurrencyService } from '../currency';

import { ServiceContext } from '../../../types/core';

const chance = new Chance();

describe('Currency Service', () => {
  describe('#constructor', () => {
    it('doesn\'t construct without a ServiceContext object', () => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const svc = new CurrencyService(undefined as unknown as ServiceContext);
        expect(svc).toBeUndefined();
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe('TypeError');
        expect(error.message).toContain('\'currencyRepository\' of undefined');
      }
    });

    it('constructs with an empty object', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const svc = new CurrencyService({} as ServiceContext);
      expect(svc).toBeDefined();
      expect(svc).toBeInstanceOf(CurrencyService);
      expect(svc).toHaveProperty('currencyRepository', undefined);
    });
  });

  describe('#updateCurrency', () => {
    it('should update an currency with success', async () => {
      const fakeRepo = {
        updateCurrency: jest.fn(),
      };

      const svc = new CurrencyService({
        currencyRepository: fakeRepo,
      } as unknown as ServiceContext);

      const params = {
        id: chance.guid({ version: 4 }),
        value: chance.floating(),
      };

      await svc.updateCurrency(params);

      expect(fakeRepo.updateCurrency).toHaveBeenCalledTimes(1);
      expect(fakeRepo.updateCurrency).toHaveBeenCalledWith(params);
    });

    it('executes with an empty object and throw the error from the repository', async () => {
      const errorMessage = 'some error';

      const fakeRepo = {
        updateCurrency: jest.fn(() => {
          throw new Error(errorMessage);
        }),
      };

      const params = {
        id: chance.guid({ version: 4 }),
        value: chance.floating(),
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const svc = new CurrencyService({
        currencyRepository: fakeRepo,
      } as unknown as ServiceContext);

      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        await svc.updateCurrency(params);
      } catch (error) {
        expect(error.message).toEqual(errorMessage);
        expect(fakeRepo.updateCurrency).toHaveBeenCalledTimes(1);
        expect(fakeRepo.updateCurrency).toHaveBeenCalledWith(params);
      }
    });
  });

  describe('#getValueCurrencies', () => {
    it('should get value in currencies with success', async () => {
      const prices = [{
        name: chance.string({ length: 3 }),
        price: chance.floating(),
      }];

      const fakeRepo = {
        getValueCurrencies: jest.fn().mockResolvedValue(prices),
      };

      const svc = new CurrencyService({
        currencyRepository: fakeRepo,
      } as unknown as ServiceContext);

      const params = {
        amount: chance.floating(),
      };

      const response = await svc.getValueCurrencies(params);

      expect(fakeRepo.getValueCurrencies).toHaveBeenCalledTimes(1);
      expect(fakeRepo.getValueCurrencies).toHaveBeenCalledWith(params);
      expect(response).toEqual(prices);
    });

    it('executes with an empty object and throw the error from the repository', async () => {
      const errorMessage = 'some error';

      const params = {
        amount: chance.floating(),
      };

      const fakeRepo = {
        getValueCurrencies: jest.fn(() => {
          throw new Error(errorMessage);
        }),
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const svc = new CurrencyService({
        currencyRepository: fakeRepo,
      } as unknown as ServiceContext);

      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        await svc.getValueCurrencies(params);
      } catch (error) {
        expect(error.message).toEqual(errorMessage);
        expect(fakeRepo.getValueCurrencies).toHaveBeenCalledTimes(1);
        expect(fakeRepo.getValueCurrencies).toHaveBeenCalledWith(params);
      }
    });
  });

  describe('#addCurrency', () => {
    it('should create an currency with success', async () => {
      const fakeRepo = {
        addCurrency: jest.fn(),
      };

      const svc = new CurrencyService({
        currencyRepository: fakeRepo,
      } as unknown as ServiceContext);

      const params = {
        name: chance.string({ length: 3 }),
        value: chance.floating(),
      };

      await svc.addCurrency(params);

      expect(fakeRepo.addCurrency).toHaveBeenCalledTimes(1);
      expect(fakeRepo.addCurrency).toHaveBeenCalledWith(params);
    });

    it('executes with an empty object and throw the error from the repository', async () => {
      const errorMessage = 'some error';

      const fakeRepo = {
        addCurrency: jest.fn(() => {
          throw new Error(errorMessage);
        }),
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const svc = new CurrencyService({
        currencyRepository: fakeRepo,
      } as unknown as ServiceContext);

      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        await svc.addCurrency({});
      } catch (error) {
        expect(error.message).toEqual(errorMessage);
        expect(fakeRepo.addCurrency).toHaveBeenCalledTimes(1);
        expect(fakeRepo.addCurrency).toHaveBeenCalledWith({});
      }
    });
  });

  describe('#listsCurrencies', () => {
    it('should list all currencies with success', async () => {
      const currencies = [{
        name: chance.string({ length: 3 }),
        value: chance.floating(),
        id: chance.guid({ version: 4 }),
        createdAt: chance.date().toISOString(),
        updatedAt: chance.date().toISOString(),
      }, {
        name: chance.string({ length: 3 }),
        value: chance.floating(),
        id: chance.guid({ version: 4 }),
        createdAt: chance.date().toISOString(),
        updatedAt: chance.date().toISOString(),
      }];
      const fakeRepo = {
        listsCurrencies: jest.fn().mockResolvedValue(currencies),
      };

      const svc = new CurrencyService({
        currencyRepository: fakeRepo,
      } as unknown as ServiceContext);

      const response = await svc.listsCurrencies();

      expect(fakeRepo.listsCurrencies).toHaveBeenCalledTimes(1);
      expect(response).toEqual(currencies);
    });

    it('executes with an empty object and throw the error from the repository', async () => {
      const errorMessage = 'some error';

      const fakeRepo = {
        listsCurrencies: jest.fn(() => {
          throw new Error(errorMessage);
        }),
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const svc = new CurrencyService({
        currencyRepository: fakeRepo,
      } as unknown as ServiceContext);

      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        await svc.listsCurrencies();
      } catch (error) {
        expect(error.message).toEqual(errorMessage);
        expect(fakeRepo.listsCurrencies).toHaveBeenCalledTimes(1);
        expect(fakeRepo.listsCurrencies).toHaveBeenCalledWith();
      }
    });
  });
});
