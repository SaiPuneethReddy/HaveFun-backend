const { ExpressPeerServer } = require("peer");
const expressApp = require('./Controller/ExpressController');

const peerServer = ExpressPeerServer(expressApp.gethttpServer(), {
    debug: true,
    path: '/myapp'
  });