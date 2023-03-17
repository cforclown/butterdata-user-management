import Joi from 'joi';

export const CreateUserPayloadSchema = Joi.object({
  email: Joi.string().email().required(),
  fullname: Joi.string().required(),
  password: Joi.string()
});

export const UpdateUserPayloadSchema = Joi.object({
  _id: Joi.string().required(),
  email: Joi.string().email(),
  fullname: Joi.string()
});
