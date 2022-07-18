import joi from 'joi';

export const sendMessageSchema = joi.object({
  message: joi.string().required(),
  from: joi.string().required(),
  to: joi.string().required(),
}).required();
