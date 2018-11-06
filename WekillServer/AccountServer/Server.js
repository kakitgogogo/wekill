var WebSocket = require('ws');
var uuid = require('uuid');
var Player = require('../Models/Player');
var Room = require('../Models/Room');
var hallServer = require('../HallServer/Server')

class AccountServer {
    constructor(port=8180) {
        this.wss = new WebSocket.Server({port:port});
        this.players = new Map();
    }

    send(id, data) {
        let player = this.players.get(id);
        if(player) {
            player.ws.send(JSON.stringify(data));
        }
    }

    sendAll(data) {
        for(let player of this.players.values()) {
            player.ws.send(JSON.stringify(data));
        }
    }

    start() {
        this.wss.on('connection', (ws) => {
            let id = uuid.v4();
            let player = new Player(id, ws);
            this.players.set(id, player);
            console.log('client connected');

            hallServer.registerEnterRoom(player);

            ws.on('close', () => {
                console.log('client disconnected');
                if(player.room) {
                    let room = player.room;
                    player.room.broadcast(player, {'event':'playerLeave', 'seat':player.seat});
                    player.room.leave(player);
                    if(room.empty()) {
                        hallServer.destroyRoom(room.id);
                    }
                }
                this.players.delete(id);
            });

            ws.on('message', (message) => {
                let data = JSON.parse(message);
                console.log('received request:');
                console.log(data);
                if(data.event) {
                    let handler = player.handlers.get(data.event);
                    if(handler) {
                        handler(data);
                    }
                }
            });
        });
    }

    getPlayer(playerId) {
        return this.players.get(playerId);
    }

    getPlayers() {
        return this.players;
    }
}

server = new AccountServer();

module.exports = server;