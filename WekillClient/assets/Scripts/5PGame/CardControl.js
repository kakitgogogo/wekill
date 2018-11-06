var global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        holdTimeEclipse: 0,
        holdClick: false,
        isPressed: false,

        id: 0,
        cardName: '',
        cardColor: '',
        cardNumber: 0,
        game: cc.Node,

        effectName: null,

        activePlayers: [],
        chosenPlayers: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        //touchstart   touchend
        this.node.on('touchstart', function(event){
            this.holdClick = true;
            this.holdTimeEclipse = 0;
        },this);
        this.node.on('touchend', function(event){
            this.holdClick = false;
            // 按0.5ms以上为长按
            if(this.holdTimeEclipse >= 30)
            {
                this.onlongclick();
            }
            else
            {
                if(this.isPressed) {
                    this.cardDownAtion();
                    this.game.onChosenCardsChange();
                    this.onsecondshortclick(this.node);
                }
                else {
                    this.cardUpAction();
                    this.game.onChosenCardsChange();
                    this.onfirstshortclick(this.node);
                }
            }
            this.holdTimeEclipse = 0;
        },this);
    },

    start () {
    },

    update: function (dt) {
        if(this.holdClick)
        {
            this.holdTimeEclipse++;
            if(this.holdTimeEclipse >= 60)
            {
                this.holdTimeEclipse = 60;
            }
        }
    },

    // Card action
    cardUpAction() {
        this.isPressed = true;
        this.game.chosenCards.add(this.id);
        let cardup = cc.moveBy(0.3, cc.v2(0, 30));
        this.node.runAction(cardup);
    },

    cardDownAtion() {
        this.isPressed = false;
        this.game.chosenCards.delete(this.id);
        let carddown = cc.moveBy(0.3, cc.v2(0, -30));
        this.node.runAction(carddown);
    },

    // handlers
    onlongclick(node) {
        console.log('longclick');
    },

    onfirstshortclick(node) {
        console.log('firstshortclick');
    },

    onsecondshortclick(node) {
        console.log('secondshortclick');
    },

    // simulate short click
    botClick() {
        this.node.emit('touchstart');
        this.node.emit('touchend');
    },

    // helper
    activePlayer(player) {
        player.getChildByName('ValidFrame').active = true;
        this.activePlayers.push(player);
    },
    deactivePlayers() {
        for(let activePlayer of this.activePlayers) {
            activePlayer.getChildByName('ValidFrame').active = false;
            activePlayer.getChildByName('SelectedFrame').active = false;
            activePlayer.getComponent('PlayerControl').chooseHandler = () => {};
        }
        this.activePlayers = [];
    },

    choosePlayer(player, seat) {
        player.getChildByName('ValidFrame').active = false;
        player.getChildByName('SelectedFrame').active = true;
        player.getComponent('PlayerControl').chooseHandler = () => {};
        this.chosenPlayers.push(seat);
    },

    changeCardEffect(name) {
        this.effectName = name;
    },
    restoreCardEffect() {
        this.effectName = this.cardName;
    },
    getCardEffect() {
        if(this.effectName) return this.effectName;
        return this.cardName;
    }
});
