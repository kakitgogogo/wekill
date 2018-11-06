class Socket {
    constructor() {
        this.ws = new WebSocket('ws://172.18.55.133:8180');
        this.handlers = new Map();
        this.handlersBackup = new Map();
        this.ws.onopen = () => {
            console.log('Connected to server...');
        };
        this.ws.onmessage = (e) => {
            console.log(e.data);
            let data = JSON.parse(e.data);
            if(data.event) {
                let handler = this.handlers.get(data.event);
                if(handler) {
                    handler(data);
                }
            }
        };
    }

    send(data) {
        this.ws.send(JSON.stringify(data));
    }

    receive(handler, once=true) {
        this.ws.onmessage = (e) => {
            handler(e);
            if(once) {
                this.ws.onmessage = (e) => {
                    console.log(e.data);
                }
            }
        }
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

    saveHandler(event) {
        let handler = this.handlers.get(event);
        this.handlersBackup.set(event, handler); 
    }

    restoreHandler(event) {
        let handler = this.handlersBackup.get(event);
        this.handlers.set(event, handler); 
    }
}

var socket = new Socket();

module.exports = socket;