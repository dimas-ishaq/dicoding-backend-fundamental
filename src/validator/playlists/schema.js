const Joi = require('joi');


const postPlaylistSchema = Joi.object({
  name: Joi.string().required(),
  owner: Joi.string().required(),
});

const getPlaylistSchema = Joi.object({
  owner: Joi.string().required(),
});

const deletePlaylistSchema = Joi.object({
  playlistId: Joi.string().required(),
});

const postSongToPlaylistSchema = Joi.object({
  playlistId: Joi.string().required(),
  songId: Joi.string().required(),
});

const getSongFromPlaylistSchema = Joi.object({
  playlistId: Joi.string().required(),
});

const deleteSongFromPlaylistSchema = Joi.object({
  playlistId: Joi.string().required(),
  songId: Joi.string().required(),
});

const getPlaylistActivitiesSchema = Joi.object({
  playlistId: Joi.string().required(),

})

module.exports = { getPlaylistActivitiesSchema, postPlaylistSchema, getPlaylistSchema, deletePlaylistSchema, postSongToPlaylistSchema, getSongFromPlaylistSchema, deleteSongFromPlaylistSchema };