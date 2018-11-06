class Player {
    constructor(id, ws) {
        this.id = id;
        this.ws = ws;
        this.handlers = new Map();
        // player's state: ['idle', 'ready', 'gaming']
        this.state = 'idle';

        this.room = null;
        this.seat = -1;
        this.identity = '';
        this.isDead = false;
    }

    addHandler(event, handler) {
        this.handlers.set(event, handler);
    }

    deleteHandler(event) {
        this.handlers.delete(event);
    }

    clearHandlers() {
        this.handlers = new Map();
    }

    wsSend(data) {
        this.ws.send(JSON.stringify(data));
    }
}

module.exports = Player;