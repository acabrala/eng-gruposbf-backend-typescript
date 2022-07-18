import joi from 'joi';

import { DirectParticipant } from '../../../types/credentials';

const NUMERIC = /^\d+$/;

const directParticipantSchema = () => joi.string().valid(...Object.values(DirectParticipant));
const ispbSchema = () => joi.string().pattern(NUMERIC).length(8);

export const addCredentialsSchema = joi.object({
  params: {
    ispb: ispbSchema().required(),
  },
  body: {
    participantName: directParticipantSchema().required(),
    participantClientId: joi.string().required(),
    participantClientSecret: joi.string().required(),
  },
});

export const updateCredentialsSchema = joi.object({
  params: {
    ispb: ispbSchema().required(),
  },
  body: {
    participantName: directParticipantSchema().required(),
    participantClientId: joi.string().required(),
    participantClientSecret: joi.string().required(),
  },
});

export const removeCredentialsSchema = joi.object({
  params: {
    ispb: ispbSchema().required(),
  },
});
