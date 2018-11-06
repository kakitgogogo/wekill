
cc.Class({
    extends: cc.Component,

    properties: {
        holdTimeEclipse: 0,
        holdClick: false,

        enableCount: 0,
        hasEquiped: false,
        nMaxLaunch: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on('touchstart', (event) => {
            this.holdClick = true;
            this.holdTimeEclipse = 0;
            event.stopPropagation();
        },this);
        this.node.on('touchend', (event) => {
            this.holdClick = false;
            // 按0.5ms以上为长按
            if(this.holdTimeEclipse >= 30)
            {
            }
            else
            {
                if(this.enableCount > 0) {
                    --this.enableCount;
                    this.launchSkill();
                }
            }
            event.stopPropagation();
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
    },

    launchSkill() {
        console.log('Launch skill');
    },

    active() {
        this.enableCount = this.nMaxLaunch;
    },

    deactive() {
        this.enableCount = 0;
    }
});
