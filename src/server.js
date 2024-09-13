const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');
const UsersService = require('./service/UsersService');
const UserValidator = require('./validator/users');
const AlbumsService = require('./service/AlbumsService');
const SongsService = require('./service/SongsService')
const AlbumValidator = require('./validator/albums');
const SongValidator = require('./validator/songs');
const albums = require('./api/albums');
const songs = require('./api/songs');
const users = require('./api/users');
const authentications = require('./api/authentications');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationService = require('./service/AuthenticationService');
const AuthenticationValidator = require('./validator/authentications');
const Jwt = require('@hapi/jwt');
const playlists = require('./api/playlists');
const PlaylistService = require('./service/PlaylistService');
const PlaylistValidator = require('./validator/playlists');
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./service/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');


require('dotenv').config()

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationService = new AuthenticationService();
  const collaborationsService = new CollaborationsService();
  const playlistService = new PlaylistService(collaborationsService);


  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });


  await server.register([
    {
      plugin: Jwt,
    }
  ])

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifact) => ({
      isValid: true,
      credentials: { id: artifact.decoded.payload.id }

    })
  })



  await server.register([
    {
      plugin: authentications,
      options: {
        authenticationService: authenticationService,
        usersService: usersService,
        tokenManager: TokenManager,
        validator: AuthenticationValidator
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UserValidator
      }
    },
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
    },
    {
      plugin: playlists,
      options: {
        service: playlistService,
        validator: PlaylistValidator,
        collaborationsService: collaborationsService
      }
    }
    ,
    {
      plugin: collaborations,
      options: {
        service: collaborationsService,
        validator: CollaborationsValidator,
        playlistService: playlistService
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