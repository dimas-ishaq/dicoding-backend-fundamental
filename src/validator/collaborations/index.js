const CollaborationsSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');
const CollaborationsValidator = {
  validateCollaborationsPayload: (payload) => {
    const collaborationsValidation = CollaborationsSchema.validate(payload);
    if (collaborationsValidation.error) {
      throw new InvariantError(collaborationsValidation.error.message);
    }
  }
};

module.exports = CollaborationsValidator;