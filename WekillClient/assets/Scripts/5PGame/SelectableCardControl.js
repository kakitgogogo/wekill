var global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        holdTimeEclipse: 0,
        holdClick: false,
        isPressed: false,

        id: null,
        frame: cc.Node,

        enable: true,
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
            if(this.enable) {
                if(this.holdTimeEclipse >= 30)
                {
                }
                else
                {
                    if(this.isPressed) {
                        this.frame.active = false;
                        this.isPressed = false;
                        this.game.selectedOthersCards.delete(this.id);
                        this.game.onSelectedOthersCardsChange();
                    }
                    else {
                        this.frame.active = true;
                        this.isPressed = true;
                        this.game.selectedOthersCards.add(this.id);
                        this.game.onSelectedOthersCardsChange();
                    }
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
});
