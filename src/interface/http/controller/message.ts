import httpStatus from 'http-status-codes';
import R from 'ramda';

import {
  NotFoundError,
} from '../../../util/error';
import {
  searchEntrySchema,
  removeEntrySchema,
  getEntry,
  addEntrySchema,
  updateEntrySchema,
  listEntriesByBankAccount,
} from '../schema/entry';

import {
  IHttpRoute,
  HttpControllerConfig,
  HttpRouter,
  HttpRequest,
  HttpResponse,
  HttpNext,
} from '../../../types/interface';

export class MessageController implements IHttpRoute {
  private _validator: HttpControllerConfig['validator'];
  private messageUseCase: HttpControllerConfig['coreContainer']['messageUseCase'];

  constructor({ coreContainer, validator }: HttpControllerConfig) {
    this._validator = validator;
    this.messageUseCase = coreContainer.messageUseCase;
  }

  register(router: HttpRouter) {
    /**
     * /dict/:ispb/entries Routes
     */
    router
      .route('/v1/message')
      .get(
        this.getMessage.bind(this),
      )
      .post(
        this.sendMessage.bind(this),
      );
  }

  async sendMessage(req: HttpRequest, res: HttpResponse, next: HttpNext) {
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

  async getMessage(req: HttpRequest, res: HttpResponse, next: HttpNext) {
    try {
      const result = await this.messageUseCase.getMessage();

      res.status(httpStatus.OK).send({
        result,
      });
    } catch (err) {
      next(err);
    }
  }
}
