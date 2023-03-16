import Joi from 'joi';

export const LoginPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

export const RegisterPayloadSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  fullname: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required()
});

export const RefreshTokenPayloadSchema = Joi.object({
  refreshToken: Joi.string().required()
});
