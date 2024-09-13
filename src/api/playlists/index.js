const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { service, validator, collaborationsService }) => {
    const playlistHandler = new PlaylistHandler(service, validator, collaborationsService);
    server.route(routes(playlistHandler))

  }

}