cc.Class({
    extends: cc.Component,

    properties: {
        holdTimeEclipse:0,
        holdClick:false,
        doubleTimeEclipse:60,
    },
    // use this for initialization
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
                this.onshortclick();
            }
            // 双击间隔 1s
            if(this.doubleTimeEclipse <= 60)
            {
                this.ondoubleclick();
            }            
           // 开始记录时间
            this.holdTimeEclipse = 0;
            this.doubleTimeEclipse = 0;
        },this);
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.holdClick)
        {
            this.holdTimeEclipse++;
            if(this.holdTimeEclipse >= 60)
            {
                this.holdTimeEclipse = 60;
            }
        }
    
        this.doubleTimeEclipse++;
        if(this.doubleTimeEclipse >= 90)
        {
            this.doubleTimeEclipse = 90;
        }
    },

    // handlers
    onlongclick() {
        console.log('longclick');
    },

    onshortclick() {
        console.log('shortclick');
    },

    ondoubleclick() {
        console.log('doubleclick');
    },
});
