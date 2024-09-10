class SongsHandler {

  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    this.validator.validateSongPayload(request.payload);
    const songId = await this.service.addSong(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        songId: songId
      }
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request, h) {
    const { title, performer } = request.query;
    const songs = await this.service.getSongs({ title, performer });
    const response = h.response({
      status: 'success',
      data: {
        songs: songs.map((song) => ({
          id: song.id,
          title: song.title,
          performer: song.performer,
        })),
      },
    });

    response.code(200);
    return response;
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this.service.getSongsById(id);
    const response = h.response({
      status: 'success',
      data: {
        song: song
      }
    })
    response.code(200);
    return response;
  }

  async putSongByIdHandler(request, h) {
    this.validator.validateSongPayload(request.payload);
    const { id } = request.params;
    await this.service.editSongById(id, request.payload);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil diperbarui'
    })
    response.code(200);
    return response;
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this.service.deleteSongById(id);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus'
    })
    response.code(200);
    return response;
  }
}

module.exports = SongsHandler;