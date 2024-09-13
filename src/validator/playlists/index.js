const InvariantError = require('../../exceptions/InvariantError');
const { postPlaylistSchema, getPlaylistActivitiesSchema, getPlaylistSchema, deletePlaylistSchema, postSongToPlaylistSchema, getSongFromPlaylistSchema, deleteSongFromPlaylistSchema } = require('./schema');

const PlaylistValidator = {
  validatePostPlaylistPayload: (payload) => {
    const playlistValidation = postPlaylistSchema.validate(payload);
    if (playlistValidation.error) {
      throw new InvariantError(playlistValidation.error.message);
    }
  },
  validateGetPlaylistPayload: (payload) => {
    const playlistValidation = getPlaylistSchema.validate(payload);
    if (playlistValidation.error) {
      throw new InvariantError(playlistValidation.error.message);
    }
  },
  validateDeletePlaylistPayload: (payload) => {
    const playlistValidation = deletePlaylistSchema.validate(payload);
    if (playlistValidation.error) {
      throw new InvariantError(playlistValidation.error.message);
    }
  },
  validatePostPlaylistSongPayload: (payload) => {
    const playlistSongValidation = postSongToPlaylistSchema.validate(payload);
    if (playlistSongValidation.error) {
      throw new InvariantError(playlistSongValidation.error.message);
    }
  },

  validateGetPlaylistSongPayload: (payload) => {
    const playlistSongValidation = getSongFromPlaylistSchema.validate(payload);
    if (playlistSongValidation.error) {
      throw new InvariantError(playlistSongValidation.error)
    }
  },
  validateDeletePlaylistSongPayload: (payload) => {
    const playlistSongValidation = deleteSongFromPlaylistSchema.validate(payload);
    if (playlistSongValidation.error) {
      throw new InvariantError(playlistSongValidation.error)
    }
  },
  validateGetPlaylistActivitiesPayload: (payload) => {
    const playlistActivityValidation = getPlaylistActivitiesSchema.validate(payload);
    if (playlistActivityValidation.error) {
      throw new InvariantError(playlistActivityValidation.error)
    }
  }
}



module.exports = PlaylistValidator;