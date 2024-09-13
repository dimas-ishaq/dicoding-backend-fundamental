const { mapDataPlaylistSongs } = require('../../utils');

class PlaylistHandler {

  constructor(service, validator, collaborationsService) {
    this.service = service
    this.validator = validator
    this.collaborationsService = collaborationsService;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongFromPlaylistHandler = this.getSongFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
    this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    const { name } = request.payload;
    const { id: owner } = request.auth.credentials;
    this.validator.validatePostPlaylistPayload({ name, owner });
    const playlistId = await this.service.addPlaylist(name, owner);



    const response = h.response({
      status: 'success',
      data: {
        playlistId: playlistId
      }
    })
    response.code(201);
    return response;

  }

  async getPlaylistsHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    this.validator.validateGetPlaylistPayload({ owner });
    const playlists = await this.service.getPlaylist(owner);
    const response = h.response({
      status: 'success',
      data: {
        playlists: playlists.map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          username: playlist.username
        }))
      }
    })
    response.code(200);
    return response;
  }

  async deletePlaylistHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;
    this.validator.validateDeletePlaylistPayload({ playlistId });
    await this.service.verifyUserPlaylist(playlistId, owner);
    await this.service.deletePlaylist(playlistId, owner);
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus'
    })
    response.code(200);
    return response;
  }

  async postSongToPlaylistHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    this.validator.validatePostPlaylistSongPayload({ playlistId, songId });
    await this.service.verifySongExist(songId);
    await this.service.verifyUserPlaylistAccess(playlistId, owner);
    await this.service.addSongToPlaylist(playlistId, songId);
    await this.service.addPlaylistActivites({
      playlist_id: playlistId,
      song_id: songId,
      user_id: owner,
      action: 'add'
    })
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan kedalam playlist'

    })
    response.code(201);
    return response;
  }

  async getSongFromPlaylistHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;
    this.validator.validateGetPlaylistSongPayload({ playlistId });
    await this.service.verifyUserPlaylistAccess(playlistId, owner);
    const playlist = await this.service.getSongsFromPlaylist(playlistId);
    const response = h.response({
      status: 'success',
      data: {
        playlist: mapDataPlaylistSongs(playlist)
      }
    })
    response.code(200);
    return response;
  }
  async deleteSongFromPlaylistHandler(request, h) {
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: owner } = request.auth.credentials;
    this.validator.validateDeletePlaylistSongPayload({ playlistId, songId });
    await this.service.verifyUserPlaylistAccess(playlistId, owner);
    await this.service.deleteSongFromPlaylist(playlistId, songId);
    await this.service.addPlaylistActivites({
      playlist_id: playlistId,
      song_id: songId,
      user_id: owner,
      action: 'delete'
    })
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist'
    })
    response.code(200);
    return response;

  }

  async getPlaylistActivitiesHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;
    await this.service.verifyUserPlaylistAccess(playlistId, owner);

    this.validator.validateGetPlaylistActivitiesPayload({ playlistId });
    const activities = await this.service.getPlaylistActivities(playlistId);
    const response = h.response({
      status: 'success',
      data: {
        playlistId: playlistId,
        activities
      }
    })
    response.code(200);
    return response;
  }
}

module.exports = PlaylistHandler