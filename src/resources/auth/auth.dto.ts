import Joi from 'joi';

export const LoginPayloadSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const LoginGooglePayloadSchema = Joi.object({
  email: Joi.string().email().required(),
  fullname: Joi.string().required()
});

export const RegisterPayloadSchema = Joi.object({
  email: Joi.string().email().required(),
  fullname: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required()
});

export const RefreshTokenPayloadSchema = Joi.object({
  refreshToken: Joi.string().required()
});
export const AccessTokenPayloadSchema = Joi.object({
  refreshToken: Joi.string().required()
});
