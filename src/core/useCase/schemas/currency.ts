import joi from 'joi';

export const addCurrencySchema = joi.object({
  value: joi.number().required(),
  name: joi.string().required(),
}).required();

export const updateCurrencySchema = joi.object({
  id: joi.string().required(),
  value: joi.number().required(),
});

export const getValueCurrencieschema = joi.object({
  amount: joi.number().required(),
});
