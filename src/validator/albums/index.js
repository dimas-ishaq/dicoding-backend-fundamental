const InvariantError = require('../../exceptions/InvariantError');
const AlbumSchema = require('./schema');

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const albumValidation = AlbumSchema.validate(payload);
    if (albumValidation.error) {
      throw new InvariantError(albumValidation.error.message);
    }
  }
}
module.exports = AlbumValidator;