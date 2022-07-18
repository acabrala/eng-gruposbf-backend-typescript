import httpStatus from 'http-status-codes';
import R from 'ramda';

import {
  NotFoundError,
} from '../../../util/error';
import {
  createCurrency,
} from '../schema/currency';

import {
  IHttpRoute,
  HttpControllerConfig,
  HttpRouter,
  HttpRequest,
  HttpResponse,
  HttpNext,
} from '../../../types/interface';

export class CurrenncyController implements IHttpRoute {
  private _validator: HttpControllerConfig['validator'];
  private currencyUseCase: HttpControllerConfig['coreContainer']['messageUseCase'];

  constructor({ coreContainer, validator }: HttpControllerConfig) {
    this._validator = validator;
    this.messageUseCase = coreContainer.messageUseCase;
  }

  register(router: HttpRouter) {
    /**
     * /dict/:ispb/entries Routes
     */
    router
      .route('/v1/currency')
      .get(
        this._validator(createCurrency),
        this.getCurrency.bind(this),
      )
      .post(
        this.addCurrency.bind(this),
      )
      .patch(
        this.updateCurrency.bind(this),
      );
  }

  async addCurrency(req: HttpRequest, res: HttpResponse, next: HttpNext) {
    try {
      const {
        message,
        from,
        to,
      } = req.body;

      const result = await this.messageUseCase.sendMessage({ message, from, to });

      res.status(httpStatus.CREATED).send({
        entryId: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getCurrency(req: HttpRequest, res: HttpResponse, next: HttpNext) {
    try {
      const result = await this.messageUseCase.getMessage();

      res.status(httpStatus.OK).send({
        result,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateCurrency(req: HttpRequest, res: HttpResponse, next: HttpNext) {
    try {

    } catch (err) {
      next(err);
    }
  }
}
