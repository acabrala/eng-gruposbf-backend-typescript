import { Chance } from 'chance';

import { addCredentialsSchema, updateCredentialsSchema, removeCredentialsSchema } from '../credentials';

import { DirectParticipant } from '../../../../types/credentials';

const chance = new Chance();

describe('Credentials schema unit tests', () => {
  describe('Add Credentials', () => {
    it('should be a valid data', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          participantName: DirectParticipant.ITAU,
          participantClientId: chance.guid({ version: 4 }),
          participantClientSecret: chance.string({ alpha: true }),
        },
      };

      const { error } = addCredentialsSchema.validate(data);

      expect(error).toBeUndefined();
    });

    it('throw error with empty body params', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {},
      };

      const { error } = addCredentialsSchema.validate(data);

      expect(error?.message).toMatch('"body.participantName" is required');
    });

    it('throw error with invalid ispb', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 20 }),
        },
        body: {
          participantName: DirectParticipant.TOPAZIO,
          participantClientId: chance.guid({ version: 4 }),
          participantClientSecret: chance.string({ alpha: true }),
        },
      };

      const { error } = addCredentialsSchema.validate(data);

      expect(error?.message).toMatch(
        '"params.ispb" length must be 8 characters long',
      );
    });

    it('throw error with invalid participantName value', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          participantName: chance.string(),
          participantClientId: chance.guid({ version: 4 }),
          participantClientSecret: chance.string({ alpha: true }),
        },
      };

      const { error } = addCredentialsSchema.validate(data);

      expect(error?.message).toMatch(
        '"body.participantName" must be one of',
      );
    });
  });

  describe('Update Credentials', () => {
    it('should be a valid data', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          participantName: DirectParticipant.TOPAZIO,
          participantClientId: chance.guid({ version: 4 }),
          participantClientSecret: chance.guid({ version: 4 }),
        },
      };

      const { error } = updateCredentialsSchema.validate(data);

      expect(error).toBeUndefined();
    });

    it('throw error with invalid ispb', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 10 }),
        },
        body: {
          participantName: DirectParticipant.TOPAZIO,
          participantClientId: chance.guid({ version: 4 }),
          participantClientSecret: chance.guid({ version: 4 }),
        },
      };

      const { error } = updateCredentialsSchema.validate(data);

      expect(error?.message).toEqual('"params.ispb" length must be 8 characters long');
    });

    it('throw error with invalid direct participant', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          participantName: 'ANOTHER' as DirectParticipant,
          participantClientId: chance.guid({ version: 4 }),
          participantClientSecret: chance.guid({ version: 4 }),
        },
      };

      const { error } = updateCredentialsSchema.validate(data);

      expect(error?.message).toMatch('"body.participantName" must be one of');
    });

    it('throw error when is not informed credentials required fields', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          participantName: DirectParticipant.TOPAZIO,
        },
      };

      const { error } = updateCredentialsSchema.validate(data);

      expect(error?.message).toEqual('"body.participantClientId" is required');
    });
  });

  describe('#removeCredentialsSchema', () => {
    it('should accept as a valid schema', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
      };

      const { error } = removeCredentialsSchema.validate(data);

      expect(error).toBeUndefined();
    });

    it('throw error with invalid ispb', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 5 }),
        },
      };

      const { error } = removeCredentialsSchema.validate(data);

      expect(error?.message).toMatch('"params.ispb" length must be 8 characters long');
    });

    it('should return error when ispb is not provided', () => {
      const data = {
        params: {},
      };

      const { error } = removeCredentialsSchema.validate(data);

      expect(error?.message).toMatch('"params.ispb" is required');
    });
  });
});
