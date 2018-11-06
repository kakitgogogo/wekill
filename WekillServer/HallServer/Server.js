var Room = require('../Models/Room');
var gameServer5P = require('../5PGameServer/Server');

class HallServer {
    constructor() {
        this.rooms = new Map();
    }

    createRoom(id, password=null) {
        if(this.rooms.has(id)) return null;
        let room = new Room(id, password, 5);
        this.rooms.set(id, room);
        console.log('Room ['+id+'] created');
        return room;
    }

    destroyRoom(id) {
        if(id === '0') return;
        this.rooms.delete(id)
        console.log('Room ['+id+'] deleted');
    }
    
    getRooms() {
        return rooms;
    }

    // Register Handlers
    registerEnterRoom(player) {
        player.addHandler('enterRoom', (data) => {
            if(!data.id) {
                palyer.wsSend({'event':'enterRoomFailed', 'message':'[internal error]wrong request data'});
            }
            else {
                let password = null, room = null;
                if(data.password) password = data.password;
                if(this.rooms.has(data.id)) {
                    room = this.rooms.get(data.id);
                }
                else {
                    room = this.createRoom(data.id, password);
                }
                let seats = room.getPlayerSeats();
                let seat = room.enter(player, password);
                if(seat === -1) {
                    player.wsSend({'event':'enterRoomFailed', 'message':'房间满人或密码错误'});
                }
                else {
                    player.room = room;
                    player.state = 'ready';
                    player.seat = seat;
        
                    player.wsSend({'event':'enterRoomSucceeded', 'seat':seat, 'seats':seats});
                    room.broadcast(player, 
                        {'event':'playerEnter', 'seat':seat});

                    player.deleteHandler('enterRoom');
                    this.registerLeaveRoom(player);
                    if(player.seat === 0) {
                        gameServer5P.registerStartGame(player);
                    }
                }
            }
        });
    }

    registerLeaveRoom(player) {
        player.addHandler('leaveRoom', (data) => {
            if(player.room) {
                let room = player.room;
                player.room.broadcast(player, {'event':'playerLeave', 'seat':player.seat});
                player.room.leave(player);
                if(room.empty()) {
                    this.destroyRoom(room.id);
                }
            }
            player.deleteHandler('leaveRoom');
            this.registerEnterRoom(player);
        });
    }
}

var server = new HallServer()

module.exports = server;