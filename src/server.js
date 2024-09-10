const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');
const AlbumsService = require('./service/AlbumsService');
const SongsService = require('./service/SongsService')
const AlbumValidator = require('./validator/albums');
const SongValidator = require('./validator/songs');
const albums = require('./api/albums');
const songs = require('./api/songs');

require('dotenv').config()

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST !== 'production' ? 'localhost' : '0.0.0.0',
  });


  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumValidator
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongValidator
      }
    }
  ]

  )

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {

      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      console.log(response.message)

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }
    return h.continue;

  })

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();