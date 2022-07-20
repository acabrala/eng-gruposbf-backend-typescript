/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatusCodes from 'http-status-codes';
import R from 'ramda';

import { BadRequestError, NotFoundError, InternalServerError } from '../../../util/error';
import { Logger } from '../../../util/logger';

import { HttpRequest, HttpResponse, HttpNext } from '../../../types/interface';

const isNotFoundError = (err: any): boolean => {
  return err instanceof NotFoundError;
};

export const errorHandler = (
  err: any,
  req: HttpRequest,
  res: HttpResponse,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: HttpNext,
) => {
  let status = httpStatusCodes.INTERNAL_SERVER_ERROR;
  let throwErr = err;

  if (isNotFoundError(err)) {
    status = httpStatusCodes.NOT_FOUND;
    throwErr = new NotFoundError(throwErr.message, throwErr.details);
  }

  if (
    err instanceof BadRequestError
  ) {
    status = httpStatusCodes.BAD_REQUEST;
  }

  if (status !== httpStatusCodes.INTERNAL_SERVER_ERROR) {
    Logger.warn(err);
  } else {
    throwErr = new InternalServerError(err.message, err.details);
    Logger.error(err);
  }

  return res
    .status(status)
    .send(R.reject(R.isNil, {
      code: throwErr.code,
      message: throwErr.message,
      details: throwErr.details,
    }));
};
