const InvariantError = require('../../exceptions/InvariantError');
const SongSchema = require('./schema');

const SongsValidator = {

  validateSongPayload: (payload) => {
    const songValidation = SongSchema.validate(payload);
    if (songValidation.error) {
      throw new InvariantError(songValidation.error.message);
    }
  },
}

module.exports = SongsValidator;