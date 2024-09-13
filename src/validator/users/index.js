const InvariantError = require('../../exceptions/InvariantError');
const UserSchema = require('./schema');

const UserValidator = {
  validateUserPayload: (payload) => {
    const userValidation = UserSchema.validate(payload);
    if (userValidation.error) {
      throw new InvariantError(userValidation.error.message);
    }
  }
}

module.exports = UserValidator;