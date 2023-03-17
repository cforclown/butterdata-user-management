export const AuthSwaggerSchemas = {
  login: {
    type: 'object',
    properties: {
      email: { type: 'string', required: true },
      password: { type: 'string', required: true }
    }
  },
  register: {
    type: 'object',
    properties: {
      email: { type: 'string', required: true },
      fullname: { type: 'string', required: true },
      password: { type: 'string', required: true },
      confirmPassword: { type: 'string', required: true }
    }
  },
  refreshToken: {
    type: 'object',
    properties: {
      refreshToken: { type: 'string', required: true }
    }
  }
};
