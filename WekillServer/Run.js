var accountServer = require('./AccountServer/Server');
var hallServer = require('./HallServer/Server');

accountServer.start();

console.log('Servers started...');

// room for testing
hallServer.createRoom('0', '7355608');