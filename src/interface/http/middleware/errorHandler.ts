/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatusCodes from 'http-status-codes';
import R from 'ramda';

import {
  BadRequestError,
  EntryAlreadyExists,
  EntryInCustodyOfDifferentParticipant,
  EntryInCustodyOfDifferentCheckingAccount,
  EntryLimitExceeded,
  EntryOwnedByDifferentPerson,
  InternalServerError,
  InvalidClaimToConfirm,
  InvalidClaimToFind,
  InvalidEntryToFind,
  InvalidEntryToList,
  InvalidEntryToRemove,
  InvalidEntryToSearch,
  InvalidEntryToUpdate,
  NotFoundError,
  OutOfCuttingTimeError,
  InvalidEntry,
  InvalidClaim,
  EntryLockedByClaim,
  InvalidCredentialToFind,
  IdentifiedFraudRisk,
} from '../../../util/error';
import { Logger } from '../../../util/logger';

import { HttpRequest, HttpResponse, HttpNext } from '../../../types/interface';

const isNotFoundError = (err: any): boolean => {
  return err instanceof NotFoundError
  || err instanceof InvalidClaimToConfirm
  || err instanceof InvalidClaimToFind
  || err instanceof InvalidEntryToList
  || err instanceof InvalidEntryToUpdate
  || err instanceof InvalidEntryToSearch
  || err instanceof InvalidEntryToFind
  || err instanceof InvalidEntryToRemove
  || err instanceof InvalidCredentialToFind;
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
    err instanceof EntryAlreadyExists
    || err instanceof EntryLimitExceeded
    || err instanceof EntryOwnedByDifferentPerson
    || err instanceof EntryInCustodyOfDifferentParticipant
    || err instanceof EntryLockedByClaim
    || err instanceof EntryInCustodyOfDifferentCheckingAccount
  ) {
    status = httpStatusCodes.CONFLICT;
    throwErr = err;
  }

  if (
    err instanceof OutOfCuttingTimeError
  ) {
    status = httpStatusCodes.BAD_GATEWAY;
    throwErr = err;
  }

  if (
    err instanceof BadRequestError
    || err instanceof InvalidEntry
    || err instanceof InvalidClaim
  ) {
    status = httpStatusCodes.BAD_REQUEST;
  }

  if (err instanceof IdentifiedFraudRisk) {
    status = httpStatusCodes.NOT_ACCEPTABLE;
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
