
class CollaborationsHandler {
  constructor(service, validator, playlistService) {
    this.service = service;
    this.validator = validator;
    this.playlistService = playlistService;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);

  }

  async postCollaborationHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    this.validator.validateCollaborationsPayload(request.payload);
    const { playlistId, userId } = request.payload;
    await this.service.verifyUser(userId);
    await this.playlistService.verifyPlaylistExist(playlistId);
    await this.playlistService.verifyUserPlaylistAccess(playlistId, owner);
    const id = await this.service.addCollaborations(playlistId, userId);

    const response = h.response({
      status: 'success',
      data: {
        collaborationId: id
      }
    })
    response.code(201);
    return response;

  }

  async deleteCollaborationHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { playlistId, userId } = request.payload;
    this.validator.validateCollaborationsPayload(request.payload);
    await this.playlistService.verifyUserPlaylist(playlistId, owner);
    await this.service.deleteCollaboration(playlistId, userId);
    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil dihapus'
    })
    response.code(200);
    return response;
  }
}

module.exports = CollaborationsHandler;