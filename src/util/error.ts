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

export class InvalidReasonToCancelClaim extends CustomError {
  constructor(message: string) {
    super('INVALID_REASON_TO_CANCEL_CLAIM', message);
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

export class FailedToAddEntry extends CustomError {
  constructor(msg: string, details: unknown) {
    super('FAILED_TO_ADD_ENTRY', msg, details as CustomError[]);
  }
}

export class FailedToUpdateEntry extends CustomError {
  constructor(msg: string, details: unknown) {
    super('FAILED_TO_UPDATE_ENTRY', msg, details as CustomError[]);
  }
}

export class FailedToRemoveEntry extends CustomError {
  constructor(msg: string, details: unknown) {
    super('FAILED_TO_REMOVE_ENTRY', msg, details as CustomError[]);
  }
}

export class FailedToAddCredentials extends CustomError {
  constructor(msg: string) {
    super('FAILED_TO_ADD_CREDENTIALS', msg);
  }
}

export class InternalServerError extends CustomError {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details: null | any[] = null) {
    super('INTERNAL_SERVER_ERROR', message, details);
  }
}

export class BadRequestError extends CustomError {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details: null | any[] = null) {
    super('BAD_REQUEST', message, details);
  }
}

export class FailedToSearchEntry extends CustomError {
  constructor(msg: string, details: unknown) {
    super('FAILED_TO_SEARCH_ENTRY', msg, details as CustomError[]);
  }
}

export class InvalidEntryToSearch extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('INVALID_ENTRY_TO_SEARCH', msg, details as CustomError[]);
  }
}

export class FailedToGetParticipants extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('FAILED_TO_GET_PARTICIPANTS', msg, details as CustomError[]);
  }
}

export class InvalidEntryToFind extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('INVALID_ENTRY_TO_FIND', msg, details as CustomError[]);
  }
}

export class InvalidEntryToRemove extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('INVALID_ENTRY_TO_REMOVE', msg, details as CustomError[]);
  }
}

export class InvalidEntryToUpdate extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('INVALID_ENTRY_TO_UPDATE', msg, details as CustomError[]);
  }
}

export class FailedToFindEntries extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('FAILED_TO_FIND_ENTRIES', msg, details as CustomError[]);
  }
}

export class FailedToFindCredentials extends CustomError {
  constructor(msg: string) {
    super('FAILED_TO_FIND_CREDENTIALS', msg);
  }
}

export class NotFoundError extends CustomError {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details: null | any[] = null) {
    super('NOT_FOUND', message, details);
  }
}

export class FailedToRemoveCredentials extends CustomError {
  constructor(msg: string) {
    super('FAILED_TO_REMOVE_CREDENTIALS', msg);
  }
}

export class FailedToUpdateCredentials extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('FAILED_TO_UPDATE_CREDENTIALS', msg, details as CustomError[]);
  }
}

export class InvalidCredentialToUpdate extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('INVALID_CREDENTIAL_TO_UPDATE', msg, details as CustomError[]);
  }
}

export class InvalidEntryToList extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('INVALID_ENTRY_TO_LIST', msg, details as CustomError[]);
  }
}

export class FailedToListEntries extends CustomError {
  constructor(msg: string, details: unknown) {
    super('FAILED_TO_LIST_ENTRIES', msg, details as CustomError[]);
  }
}

export class FailedToSearchClaims extends CustomError {
  constructor(msg: string, details: unknown) {
    super('FAILED_TO_SEARCH_CLAIMS', msg, details as CustomError[]);
  }
}

export class InvalidClaimToSearch extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('INVALID_CLAIM_TO_SEARCH', msg, details as CustomError[]);
  }
}

export class InvalidClaimToFind extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('INVALID_CLAIM_TO_FIND', msg, details as CustomError[]);
  }
}

export class FailedToFindClaim extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('FAILED_TO_FIND_CLAIM', msg, details as CustomError[]);
  }
}

export class FailedToSaveClaim extends CustomError {
  constructor(msg: string) {
    super('FAILED_TO_SAVE_CLAIM', msg);
  }
}

export class FailedToCreateClaim extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('FAILED_TO_CREATE_CLAIM', msg, details as CustomError[]);
  }
}

export class InvalidCredentialToFind extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('INVALID_CREDENTIAL_TO_FIND', msg, details as CustomError[]);
  }
}

export class InvalidClaimToConfirm extends CustomError {
  constructor(msg: string) {
    super('INVALID_CLAIM_TO_CONFIRM', msg);
  }
}

export class InvalidClaimToCancel extends CustomError {
  constructor(msg: string) {
    super('INVALID_CLAIM_TO_CANCEL', msg);
  }
}

export class FailedToConfirmClaim extends CustomError {
  constructor(msg: string, details: unknown) {
    super('FAILED_TO_CONFIRM_CLAIM', msg, details as CustomError[]);
  }
}

export class FailedToCancelClaim extends CustomError {
  constructor(msg: string, details: unknown) {
    super('FAILED_TO_CANCEL_CLAIM', msg, details as CustomError[]);
  }
}

export class EntryAlreadyExists extends CustomError {
  constructor(msg: string) {
    super('ENTRY_ALREADY_EXISTS', msg);
  }
}

export class EntryLimitExceeded extends CustomError {
  constructor(msg: string) {
    super('ENTRY_LIMIT_EXCEEDED', msg);
  }
}

export class EntryOwnedByDifferentPerson extends CustomError {
  constructor(msg: string) {
    super('ENTRY_OWNED_BY_DIFFERENT_PERSON', msg);
  }
}

export class EntryInCustodyOfDifferentParticipant extends CustomError {
  constructor(msg: string) {
    super('ENTRY_IN_CUSTODY_OF_DIFFERENT_PARTICIPANT', msg);
  }
}

export class EntryInCustodyOfDifferentCheckingAccount extends CustomError {
  constructor(msg: string) {
    super('ENTRY_IN_CUSTODY_OF_DIFFERENT_CHECKING_ACCOUNT', msg);
  }
}

export class OutOfCuttingTimeError extends CustomError {
  constructor(msg: string) {
    super('OUT_OF_CUTTING_TIME', msg);
  }
}

export class EntryLockedByClaim extends CustomError {
  constructor(msg: string) {
    super('ENTRY_LOCKED_BY_CLAIM', msg);
  }
}

export class InvalidEntry extends CustomError {
  constructor(msg: string) {
    super('INVALID_ENTRY', msg);
  }
}

export class InvalidClaim extends CustomError {
  constructor(msg: string) {
    super('INVALID_CLAIM', msg);
  }
}

export class FailedToGetNotifications extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('FAILED_TO_GET_NOTIFICATIONS', msg, details as CustomError[]);
  }
}

export class FailedToDeleteNotifications extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('FAILED_TO_DELETE_NOTIFICATIONS', msg, details as CustomError[]);
  }
}

export class FailedToUpdateNotifications extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('FAILED_TO_UPDATE_NOTIFICATION', msg, details as CustomError[]);
  }
}

export class FailedToSendNotification extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('FAILED_TO_SEND_NOTIFICATION', msg, details as CustomError[]);
  }
}

export class FailedToProcessClaimNotification extends CustomError {
  constructor(msg: string, details: unknown) {
    super('FAILED_TO_PROCESS_CLAIM_NOTIFICATION', msg, details as CustomError[]);
  }
}

export class NotificationDataInvalid extends CustomError {
  constructor(msg: string) {
    super('NOTIFICATION_DATA_INVALID', msg);
  }
}
export class FailedToSaveNotification extends CustomError {
  constructor(msg: string) {
    super('FAILED_TO_SAVE_NOTIFICATION', msg);
  }
}

export class FailedToFindPostback extends CustomError {
  constructor(msg: string) {
    super('FAILED_TO_FIND_POSTBACK', msg);
  }
}

export class InvalidPostbackToFind extends CustomError {
  constructor(msg: string) {
    super('INVALID_POSTBACK_TO_FIND', msg);
  }
}

export class IdentifiedFraudRisk extends CustomError {
  constructor(msg: string) {
    super('IDENTIFIED_FRAUD_RISK', msg);
  }
}

export class FailedToGetPhiAuthorization extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('FAILED_TO_GET_PHI_AUTHORIZATION', msg, details as CustomError[]);
  }
}

export class FailedToCheckEntryFraud extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('FAILED_TO_CHECK_ENTRY_FRAUD', msg, details as CustomError[]);
  }
}

export class FailedToCheckClaimFraud extends CustomError {
  constructor(msg: string, details?: unknown) {
    super('FAILED_TO_CHECK_CLAIM_FRAUD', msg, details as CustomError[]);
  }
}
