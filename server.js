

const runHttpServer = require('./Controller/ExpressController');
const runSocketServer = require('./Service/SocketServer');
const {execSync} = require('child_process');


runHttpServer.runHttpServer();
runSocketServer.runSocketServer(); 





