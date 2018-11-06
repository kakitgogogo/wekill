var socket = require('Socket');
var global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        enterRoomButton: {
            default: null,
            type: cc.Node
        },
        quickStartButton: {
            default: null,
            type: cc.Node
        },
        roomInputBox: {
            default: null,
            type: cc.Node
        },
    },

    onEnterRoomClick() {
        this.enterRoomButton.active = false;
        this.quickStartButton.active = false;
        this.roomInputBox.active = true;
    },

    onRoomInputCancel() {
        this.enterRoomButton.active = true;
        this.quickStartButton.active = true;
        this.roomInputBox.active = false;
    },

    onRoomIdInputChanged(text) {
        if(text.length > 0) {
            this.roomId = text;
        }
        else {
            this.roomId = null;
        }
    },

    onRoomPasswordInputChanged(text) {
        if(text.length > 0) {
            this.roomPassword = text;
        }
        else {
            this.roomPassword = null;
        }
    },

    onEnterRoomConfirm() {
        if(!this.roomId) return;
        socket.send({'event':'enterRoom', 'id':this.roomId, 'password':this.roomPassword});
        socket.addHandler('enterRoomSucceeded', (data) => {
            global.set('roomId', this.roomId);
            global.set('seat', data.seat);
            global.set('seats', data.seats);
            cc.director.loadScene('5PGame');

            socket.deleteHandler('enterRoomSucceeded');
        });
        socket.addHandler('enterRoomFailed', (data) => {
            let errorShow = cc.find("ErrorMessage", this.roomInputBox);
            errorShow.getComponent(cc.Label).string = data.message;
            
            socket.deleteHandler('enterRoomFailed');
        });
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.roomInputBox.active = false;
        this.roomId = null;
        this.roomPassword = null;
    },

    start () {

    },

    // update (dt) {},
});
