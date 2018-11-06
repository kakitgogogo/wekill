
cc.Class({
    extends: cc.Component,

    properties: {
        holdTimeEclipse: 0,
        holdClick: false,

        generalName: '',
        health: 0,
        maxHealth: 0,
        camp: '',
        nCards: 0,
        identity: '',
        sex: '',
        isDead: false,

        shaking: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init_x = this.node.x;
        this.init_y = this.node.y;

        this.equipments = {
            'Weapon': null,
            'Armor': null,
            'HorsePlusOne': null,
            'HorseSubOne': null,
        };

        this.placedDelayMagicCards = new Set();

        this.node.on('touchstart', (event) => {
            this.holdClick = true;
            this.holdTimeEclipse = 0;
        },this);
        this.node.on('touchend', (event) => {
            this.holdClick = false;
            // 按0.5ms以上为长按
            if(this.holdTimeEclipse >= 30)
            {
            }
            else
            {
                this.chooseHandler();
            }
        });
    },

    start () {

    },

    update (dt) {
        if(this.holdClick)
        {
            this.holdTimeEclipse++;
            if(this.holdTimeEclipse >= 60)
            {
                this.holdTimeEclipse = 60;
            }
        }
        if(this.shaking) {
            let randx = Math.random() * 10 - 5;
            let randy = Math.random() * 10 - 5;
            this.node.setPosition(randx + this.init_x, randy + this.init_y);
        }
    },

    startShaking() {
        this.shaking = true;
    },

    stopShaking() {
        this.shaking = false;
        this.node.setPosition(this.init_x, this.init_y);
    },

    // choose handler
    chooseHandler() {
        console.log('choose player');
    },
});
