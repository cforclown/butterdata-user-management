import { validateSchema } from '../../utils/validate-schema';
import { ValidationException } from '../../utils/exceptions/validation-exception';
import { CreateUserPayloadSchema, UpdateUserPayloadSchema } from './users.dto';
import { mockCreateUserPayload, mockUpdateUserPayload } from '../../test/mockData';

describe('users-data-transfer-object', () => {
  describe('CreateUserPayloadSchema', () => {
    it('should return value when schema is valid', () => {
      const result = validateSchema({ schema: CreateUserPayloadSchema, payload: mockCreateUserPayload });
      expect(result).toEqual(mockCreateUserPayload);
    });

    it('should return value when email not provided', () => {
      const result = validateSchema({ schema: CreateUserPayloadSchema, payload: mockCreateUserPayload });
      expect(result).toEqual(mockCreateUserPayload);
    });

    it('should throw validation exception when username not provided', () => {
      expect(() => validateSchema({
        schema: CreateUserPayloadSchema,
        payload: {
          ...mockCreateUserPayload,
          username: undefined
        }
      })).toThrow(ValidationException);
    });

    it('should throw validation exception when fullname not provided', () => {
      expect(() => validateSchema({
        schema: CreateUserPayloadSchema,
        payload: {
          ...mockCreateUserPayload,
          fullname: undefined
        }
      })).toThrow(ValidationException);
    });

    it('should throw validation exception when role not provided', () => {
      expect(() => validateSchema({
        schema: CreateUserPayloadSchema,
        payload: {
          ...mockCreateUserPayload,
          role: undefined
        }
      })).toThrow(ValidationException);
    });

    it('should throw validation exception when email is invalid not provided', () => {
      expect(() => validateSchema({
        schema: CreateUserPayloadSchema,
        payload: {
          ...mockCreateUserPayload,
          email: 'invalid email'
        }
      })).toThrow(ValidationException);
    });
  });

  describe('UpdateProfilePayloadSchema', () => {
    it('should return value when schema is valid', () => {
      expect(validateSchema({
        schema: UpdateUserPayloadSchema,
        payload: mockUpdateUserPayload
      })).toEqual(mockUpdateUserPayload);
      expect(validateSchema({
        schema: UpdateUserPayloadSchema,
        payload: {
          _id: 'user-id',
          fullname: 'fullname'
        }
      })).toEqual({
        _id: 'user-id',
        fullname: 'fullname'
      });
    });

    it('should allow payload only contain _id', () => {
      const result = validateSchema({ schema: UpdateUserPayloadSchema, payload: { _id: 'user-id' } });
      expect(result).toEqual({ _id: 'user-id' });
    });

    it('should throw validation exception when payload is not object', () => {
      expect(() => validateSchema({ schema: UpdateUserPayloadSchema, payload: null })).toThrow(ValidationException);
    });
  });
});
