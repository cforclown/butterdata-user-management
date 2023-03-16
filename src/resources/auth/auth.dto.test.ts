import { validateSchema } from '../../utils/validate-schema';
import { ValidationException } from '../../utils/exceptions/validation-exception';
import { LoginPayloadSchema, RefreshTokenPayloadSchema } from './auth.dto';
import { ILoginPayload } from './auth.types';

describe('auth-data-transfer-object', () => {
  const loginPayload: ILoginPayload = {
    username: 'username',
    password: 'password'
  };

  describe('LoginPayloadSchema', () => {
    it('should return value when schema is valid', () => {
      const result = validateSchema({ schema: LoginPayloadSchema, payload: loginPayload });
      expect(result).toEqual(loginPayload);
    });

    it('should throw validation exception when password not provided', () => {
      expect(() => validateSchema({
        schema: LoginPayloadSchema,
        payload: {
          username: 'username'
        }
      })).toThrow(ValidationException);
    });

    it('should throw validation exception when password not provided', () => {
      expect(() => validateSchema({
        schema: LoginPayloadSchema,
        payload: {
          password: 'password'
        }
      })).toThrow(ValidationException);
    });
  });

  describe('RefreshTokenPayloadSchema', () => {
    it('should return value when schema is valid', () => {
      const result = validateSchema({ schema: RefreshTokenPayloadSchema, payload: { refreshToken: 'refreshToken' } });
      expect(result).toEqual({ refreshToken: 'refreshToken' });
    });

    it('should throw validation exception when refreshToken not provided', () => {
      expect(() => validateSchema({ schema: RefreshTokenPayloadSchema, payload: {} })).toThrow(ValidationException);
    });
  });
});
