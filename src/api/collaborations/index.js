const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { service, validator, playlistService }) => {
    const collaborationsHandler = new CollaborationsHandler(service, validator, playlistService);
    server.route(routes(collaborationsHandler));
  }

}