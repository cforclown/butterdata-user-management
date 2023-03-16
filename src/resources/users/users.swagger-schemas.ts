export const UsersSwaggerSchemas = {
  createUser: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
      fullname: { type: 'string' }
    }
  },
  updateUser: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        default: null
      },
      email: {
        type: 'string',
        default: null
      },
      fullname: {
        type: 'string',
        default: null
      }
    }
  }
};
