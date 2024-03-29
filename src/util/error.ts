/* eslint-disable max-classes-per-file */
class CustomError extends Error {
  private code: string;
  private details: CustomError[] | null;

  constructor(
    code: string,
    message: string | null = null,
    details: CustomError[] | null = null,
  ) {
    super(message || code);
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidProperties extends CustomError {
  constructor(message: string, details: unknown) {
    super('INVALID_PROPERTIES', message, details as CustomError[]);
  }
}

export class FailedSQL extends CustomError {
  constructor(msg: string) {
    super('FAILED_SQL', msg);
  }
}

export class FailedToFindCurrency extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('FAILED_TO_FIND_CURRENCY', msg, details as CustomError[]);
  }
}

export class FailedToSaveCurrency extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('FAILED_TO_SAVE_CURRENCY', msg, details as CustomError[]);
  }
}

export class BadRequestError extends CustomError {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details: null | any[] = null) {
    super('BAD_REQUEST', message, details);
  }
}

export class NotFoundError extends CustomError {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details: null | any[] = null) {
    super('NOT_FOUND', message, details);
  }
}

export class InternalServerError extends CustomError {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details: null | any[] = null) {
    super('INTERNAL_SERVER_ERROR', message, details);
  }
}
