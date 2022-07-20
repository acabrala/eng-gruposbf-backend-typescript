import httpStatus from 'http-status-codes';
import R, { identical } from 'ramda';

import { createCurrencySchema, updateCurrencySchema, getValueCurrencieschema } from '../schema/currency';

import {
  IHttpRoute,
  HttpControllerConfig,
  HttpRouter,
  HttpRequest,
  HttpResponse,
  HttpNext,
} from '../../../types/interface';

export class CurrencyController implements IHttpRoute {
  private _validator: HttpControllerConfig['validator'];
  private currencyUseCase: HttpControllerConfig['coreContainer']['currencyUseCase'];

  constructor({ coreContainer, validator }: HttpControllerConfig) {
    this._validator = validator;
    this.currencyUseCase = coreContainer.currencyUseCase;
  }

  register(router: HttpRouter) {
    /**
     * /dict/:ispb/entries Routes
     */
    router
      .route('/v1/currency')
      .get(
        this.listsCurrencies.bind(this),
      )
      .post(
        this._validator(createCurrencySchema),
        this.addCurrency.bind(this),
      );

    router
      .route('/v1/currency/:id')
      .patch(
        this._validator(updateCurrencySchema),
        this.updateCurrency.bind(this),
      );

    router
      .route('/v1/currency/amount')
      .post(
        this._validator(getValueCurrencieschema),
        this.getValueCurrencies.bind(this),
      );
  }

  async addCurrency(req: HttpRequest, res: HttpResponse, next: HttpNext) {
    try {
      const {
        value,
        name,
      } = req.body;

      const result = await this.currencyUseCase.addCurrency({ value, name });

      res.status(httpStatus.CREATED).send({
        currencyId: result.id,
      });
    } catch (err) {
      next(err);
    }
  }

  async listsCurrencies(req: HttpRequest, res: HttpResponse, next: HttpNext) {
    try {
      const result = await this.currencyUseCase.listsCurrencies();

      res.status(httpStatus.OK).send({
        result,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateCurrency(req: HttpRequest, res: HttpResponse, next: HttpNext) {
    try {
      const { id } = req.params;
      const { value } = req.body;
      const result = await this.currencyUseCase.updateCurrency({ id, value });

      res.status(httpStatus.OK).send(result);
    } catch (err) {
      next(err);
    }
  }

  async getValueCurrencies(req: HttpRequest, res: HttpResponse, next: HttpNext) {
    try {
      const { amount } = req.body;
      const result = await this.currencyUseCase.getValueCurrencies({ amount });
      res.status(httpStatus.OK).send(result);
    } catch (err) {
      next(err);
    }
  }
}
