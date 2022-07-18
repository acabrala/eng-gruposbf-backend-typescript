import R from 'ramda';

import {
  EntryAlreadyExists,
  EntryInCustodyOfDifferentParticipant,
  EntryOwnedByDifferentPerson,
  EntryLimitExceeded,
} from '../../../util/error';

type ErrorCode= {
  code: string;
};

export type DataError = {
  type: string;
  message: string;
  errors: ErrorCode[];
};

export const checkAndThrowAddRemoteEntryError = (error: DataError) => {
  const code = R.path(['response', 'data', 'code'], error);

  if (code === 'ENTRY_ALREADY_EXISTS') {
    throw new EntryAlreadyExists('Entry already exists for this person');
  }

  if (code === 'ENTRY_LIMIT_EXCEEDED') {
    throw new EntryLimitExceeded('Entry limit exceeded for this account');
  }

  if (code === 'ENTRY_OWNED_BY_DIFFERENT_PERSON') {
    throw new EntryOwnedByDifferentPerson('Entry owned by different person');
  }

  if (code === 'ENTRY_IN_CUSTODY_OF_DIFFERENT_PARTICIPANT') {
    throw new EntryInCustodyOfDifferentParticipant('Entry in custody of different participant');
  }
};
