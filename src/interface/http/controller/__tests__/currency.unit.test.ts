import * as Uuid from '@somosphi/uuid';
import Chance from 'chance';
import httpStatus from 'http-status-codes';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import {
  InternalServerError,
} from '../../../../util/error';
import { CurrencyController } from '../currency';

import { Container } from '../../../../types/core';
import { HttpControllerConfig } from '../../../../types/interface';

const chance = new Chance();

describe('Currency Controller', () => {
  describe('#constructor', () => {
    it('should construct with correct context', async () => {
      const coreContainer = {
        currencyUseCase: {
          addCurrency: jest.fn(),
        },
      } as unknown as Container;
      const validator = jest.fn();

      const controller = new CurrencyController({ coreContainer, validator });

      expect(controller).toBeDefined();
      expect(controller.addCurrency).toBeInstanceOf(Function);
    });

    it('should explodes with empty context', async () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        new CurrencyController(); // eslint-disable-line no-new
      }).toThrow('Cannot destructure property');
    });
  });

  describe('#addCurrency', () => {
    it('should send an message with success', async () => {
      const req = new Request();
      const res = new Response();
      const next = jest.fn();

      const params = {
        value: 5.50,
        name: 'dolár',
      };

      const coreContainer = {
        currencyUseCase: {
          addCurrency: jest.fn().mockReturnThis(),
        },
      } as unknown as Container;

      const controller = new CurrencyController({ coreContainer } as HttpControllerConfig);

      req.setBody(params);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await controller.addCurrency(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(coreContainer.currencyUseCase.addCurrency).toHaveBeenCalledWith({
        name: params.name,
        value: params.value,
      });
    });

    it('should call next function with empty core', async () => {
      const req = new Request();
      const res = new Response();
      const next = jest.fn();

      const coreContainer = {} as unknown as Container;

      const controller = new CurrencyController({ coreContainer } as HttpControllerConfig);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await controller.addCurrency(req, res, next);

      expect(next).toHaveBeenCalledWith(new InternalServerError('Cannot read property \'addCurrency\' of undefined'));
    });

    it('should call next function with an unexpected error in use case', async () => {
      const req = new Request();
      const res = new Response();
      const next = jest.fn();

      const coreContainer = {
        currencyUseCase: {
          addCurrency: jest.fn(() => {
            throw new Error('some error');
          }),
        },
      } as unknown as Container;

      const controller = new CurrencyController({ coreContainer } as HttpControllerConfig);

      req.setBody('');

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await controller.addCurrency(req, res, next);

      expect(next).toHaveBeenCalledWith(new InternalServerError('some error'));
    });
  });

  describe('#listsCurrencies', () => {
    it('should send an message with success', async () => {
      const req = new Request();
      const res = new Response();
      const next = jest.fn();

      const responseFromUseCase = [
        {
          id: 1,
          name: 'USD',
          value: 5.50,
        },
        {
          id: 2,
          name: 'EUR',
          value: 6.21,
        },
        {
          id: 3,
          name: 'GBP',
          value: 7.20,
        },
      ];

      const result = [{
        id: responseFromUseCase[0].id,
        name: responseFromUseCase[0].name,
        value: responseFromUseCase[0].value,
      }];

      const coreContainer = {
        currencyUseCase: {
          listsCurrencies: jest.fn().mockResolvedValue(responseFromUseCase),
        },
      } as unknown as Container;

      const controller = new CurrencyController({ coreContainer } as HttpControllerConfig);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await controller.listsCurrencies(req, res, next);

      expect(res.send).toHaveBeenCalledWith({ result: responseFromUseCase });
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    });

    it('should call next function with empty core', async () => {
      const req = new Request();
      const res = new Response();
      const next = jest.fn();

      const coreContainer = {} as unknown as Container;

      const controller = new CurrencyController({ coreContainer } as HttpControllerConfig);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await controller.listsCurrencies(req, res, next);

      expect(next).toHaveBeenCalledWith(new InternalServerError('Cannot read property \'listsCurrencies\' of undefined'));
    });

    it('should call next function with an unexpected error in use case', async () => {
      const req = new Request();
      const res = new Response();
      const next = jest.fn();

      const coreContainer = {
        currencyUseCase: {
          listsCurrencies: jest.fn(() => {
            throw new Error('some error');
          }),
        },
      } as unknown as Container;

      const controller = new CurrencyController({ coreContainer } as HttpControllerConfig);

      req.setBody('');

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await controller.listsCurrencies(req, res, next);

      expect(next).toHaveBeenCalledWith(new InternalServerError('some error'));
    });
  });

  describe('#updateCurrency', () => {
    it('should send an message with success', async () => {
      const req = new Request();
      const res = new Response();
      const next = jest.fn();
      const id = '1';
      const params = {
        value: 5.85,
      };
      req.setParams({ id });
      const coreContainer = {
        currencyUseCase: {
          updateCurrency: jest.fn().mockReturnThis(),
        },
      } as unknown as Container;

      const controller = new CurrencyController({ coreContainer } as HttpControllerConfig);

      req.setBody(params);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await controller.updateCurrency(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(coreContainer.currencyUseCase.updateCurrency).toHaveBeenCalledWith({
        id,
        value: params.value,
      });
    });

    it('should call next function with empty core', async () => {
      const req = new Request();
      const res = new Response();
      const next = jest.fn();

      const coreContainer = {} as unknown as Container;

      const controller = new CurrencyController({ coreContainer } as HttpControllerConfig);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await controller.updateCurrency(req, res, next);

      expect(next).toHaveBeenCalledWith(new InternalServerError('Cannot read property \'updateCurrency\' of undefined'));
    });

    it('should call next function with an unexpected error in use case', async () => {
      const req = new Request();
      const res = new Response();
      const next = jest.fn();

      const coreContainer = {
        currencyUseCase: {
          updateCurrency: jest.fn(() => {
            throw new Error('some error');
          }),
        },
      } as unknown as Container;

      const controller = new CurrencyController({ coreContainer } as HttpControllerConfig);

      req.setBody('');

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await controller.updateCurrency(req, res, next);

      expect(next).toHaveBeenCalledWith(new InternalServerError('some error'));
    });
  });

  describe('#getValueCurrencies', () => {
    it('should send an message with success', async () => {
      const req = new Request();
      const res = new Response();
      const next = jest.fn();

      const params = {
        amount: 700,
      };

      const coreContainer = {
        currencyUseCase: {
          getValueCurrencies: jest.fn().mockReturnThis(),
        },
      } as unknown as Container;

      const controller = new CurrencyController({ coreContainer } as HttpControllerConfig);

      req.setBody(params);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await controller.getValueCurrencies(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(coreContainer.currencyUseCase.getValueCurrencies).toHaveBeenCalledWith({
        amount: params.amount,
      });
    });

    it('should call next function with empty core', async () => {
      const req = new Request();
      const res = new Response();
      const next = jest.fn();

      const coreContainer = {} as unknown as Container;

      const controller = new CurrencyController({ coreContainer } as HttpControllerConfig);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await controller.getValueCurrencies(req, res, next);

      expect(next).toHaveBeenCalledWith(new InternalServerError('Cannot read property \'getValueCurrencies\' of undefined'));
    });

    it('should call next function with an unexpected error in use case', async () => {
      const req = new Request();
      const res = new Response();
      const next = jest.fn();

      const coreContainer = {
        currencyUseCase: {
          getValueCurrencies: jest.fn(() => {
            throw new Error('some error');
          }),
        },
      } as unknown as Container;

      const controller = new CurrencyController({ coreContainer } as HttpControllerConfig);

      req.setBody('');

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await controller.getValueCurrencies(req, res, next);

      expect(next).toHaveBeenCalledWith(new InternalServerError('some error'));
    });
  });
});
