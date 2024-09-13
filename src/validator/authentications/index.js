

const { postAuthenticationSchema, putAuthenticationSchema, deleteAuthenticationSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const authenticationsValidation = postAuthenticationSchema.validate(payload);
    if (authenticationsValidation.error) {
      throw new InvariantError(authenticationsValidation.error.message);
    }
  },

  validatePutAuthenticationPayload: (payload) => {
    const authenticationsValidation = putAuthenticationSchema.validate(payload);
    if (authenticationsValidation.error) {
      throw new InvariantError(authenticationsValidation.error.message);
    }
  },

  validateDeleteAuthenticationPayload: (payload) => {
    const authenticationsValidation = deleteAuthenticationSchema.validate(payload);
    if (authenticationsValidation.error) {
      throw new InvariantError(authenticationsValidation.error.message);
    }
  }
};

module.exports = AuthenticationValidator;