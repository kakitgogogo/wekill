var socket = require('Socket');
var global = require('Global');
var StandardPackage = require('Standard');

function rotateArray(arr, n) {
    for(let i = 0; i < n; ++i) {
        let tmp = arr.pop();
        arr.unshift(tmp);
    }
}

cc.Class({
    extends: cc.Component,

    properties: {
        players: [cc.Node],
        cardsBox: cc.Node,
        cardPrefab: cc.Prefab,
        skillBox: cc.Node,
        skillPrefab: cc.Prefab,
        startButton: cc.Node,
        generalsBox: cc.Node,
        generalPrefab: cc.Prefab,
        controlButtons: cc.Node,
        discardPile: cc.Node,
        discardPrefab: cc.Prefab,
        selectableCardsBox: cc.Node,
        selectableCardPrefab: cc.Prefab,
    },

    // ***************** LIFE-CYCLE CALLBACKS ***************** 

    onLoad () {
        // Get world center position
        global.set('worldcenter', cc.p(this.node.x, this.node.y));
        // Make myself in the right place
        this.seat = global.get('seat');
        this.nPlayers = global.get('seats').length + 1;
        rotateArray(this.players, this.seat);
        for(let i of global.get('seats')) {
            this.setGeneralAvatar(i, "Textures/Characters/Unknown");
            this.setGeneralState(i, '准备');
        }
        // Get player contorls
        this.playerControls = [];
        for(let i = 0; i < 5; ++i) {
            this.playerControls[i] = this.players[i].getComponent('PlayerControl');
            this.playerControls[i].seat = i;
        }
        this.self = this.playerControls[this.seat];
        // Test skills' view
        for(let i = 0; i < 3; ++i) {
            let skill = cc.instantiate(this.skillPrefab);
            this.skillBox.addChild(skill);
            skill.x = 0;
            skill.y = 40 - 40 * i;
        }

        // Local variable
        this.identity = '';
        this.identities = {
            'Lord':'主', 'Loyalty':'忠', 'Traitor':'内', 'Rebel':'反'
        };
        this.self.nCards = 0;
        this.sex = '';
        this.skills = [];
        this.lordSeat = 0;
        this.chosenCards = new Set();
        this.judgeEvents = [];
        this.phase = 'ready';
        this.nKills = 0;
        this.nMaxKills = 1;
        this.nDrawCards = 2;

        this.selectedOthersCards = new Set();
        this.selectedCount = 100;

        this.isMyTurn = false;
        this.banRestoreControl = false;
        this.banResponseContinue = false;

        this.lastDamageSource = -1;
        this.lastKill = -1;
        this.canKillPlayer = null;

        this.skipPlayPhase = false;
        this.skipDiscardPhase = false;

        this.activePlayers = [];
        this.chosenPlayers = [];

        // Foreground context
        let node = cc.find('Canvas/Foreground');
        this.fgCtx = node.getComponent(cc.Graphics);

        // control buttons
        this.endPlayButton = cc.find('End', this.controlButtons);
        this.confirmButton = cc.find('Confirm', this.controlButtons);
        this.cancelButton = cc.find('Cancel', this.controlButtons);

        // weapon & armor
        this.weaponControl = this.players[this.seat].getChildByName('Weapon').getComponent('SkillControl');
        this.armorControl = this.players[this.seat].getChildByName('Armor').getComponent('SkillControl');

        this.registerPlayerEnter();
        this.registerPlayerLeave();
        this.registerStartGame();
    },

    start () {

    },

    // update (dt) {},

    // ***************** render general's info ***************** 

    setGeneralAvatar(seat, imgPath) {
        let node = cc.find('GeneralAvatar', this.players[seat]);
        cc.loader.loadRes(imgPath, cc.SpriteFrame, function (err, spriteFrame) {
            if(err) {
                console.log(err);
            }
            else {
                node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }
        });
    },

    setGeneralState(seat, state) {
        let node = cc.find('State', this.players[seat]);
        node.getComponent(cc.RichText).string = 
            '<outline color=black width=3>'+state+'</outline>'
    },

    setGeneralIdentity(seat, ident) {
        this.playerControls[seat].identity = ident;
        let node = cc.find('Ident', this.players[seat]);
        node.getComponent(cc.RichText).string = 
            '<outline color=black width=3>'+this.identities[ident]+'</outline>';
    },

    setGeneralCardsCount(seat, count) {
        this.playerControls[seat].nCards = count;
        let node = cc.find('Cards/Count', this.players[seat]);
        node.getComponent(cc.RichText).string = 
            '<outline color=black width=3>'+count+'</outline>';
    },

    setGeneralHealth(seat, num) {
        this.playerControls[seat].health = num;
        let node = cc.find('Blood/Number', this.players[seat]);
        node.getComponent(cc.RichText).string = 
            '<outline color=black width=3>'+num+'</outline>';
    },

    setGeneralAfterChosen(seat, generalName) {
        // render avatar
        this.setGeneralAvatar(seat, 'Textures/Characters/'+generalName);
        let generalInfo = StandardPackage.Generals.get(generalName),
            Camps = StandardPackage.Camps,
            node;

        // render name
        this.playerControls[seat].generalName = generalName;
        node = cc.find('GeneralName', this.players[seat]);
        node.getComponent(cc.RichText).string = 
            '<outline color=black width=3>'+generalInfo['ChineseName']+'</outline>';

        // render camp
        node = cc.find('Camp', this.players[seat]);
        node.getComponent(cc.RichText).string = 
            '<outline color=black width=3>'+Camps[generalInfo['Camp']]+'</outline>';
        this.playerControls[seat].camp = generalInfo['Camp'];
        
        // render health
        let health = generalInfo['Health'];
        if(this.lordSeat === seat) ++health;
        this.setGeneralHealth(seat, health);
        this.playerControls[seat].health = health;
        this.playerControls[seat].maxHealth = health;
        // if(this.seat === seat) {
        //     this.self.health = health;
        // }

        // sex
        this.playerControls[seat].sex = generalInfo['Sex'];;

        // render state
        this.setGeneralState(seat, '');

        // set distance
        this.playerControls[seat].weaponDistance = 1;
        this.playerControls[seat].magicDistance = 1;
        this.playerControls[seat].plusDistance = 0;
        this.playerControls[seat].subDistance = 0;

        // render skill frame (self)
        if(seat == this.seat) {
            let generalSkills = generalInfo['Skills'],
                Skills = StandardPackage.Skills,
                i = 0;

            for(i = 0; i < generalSkills.length; ++i) {
                let skillUI = this.skillBox.children[i];
                let skillInfo = Skills.get(generalSkills[i]);
                cc.find('Name', skillUI).getComponent(cc.Label).string = skillInfo['ChineseName'];
                if(!skillInfo['IsActive']) {
                    skillUI.getComponent(cc.Button).interactable = false;
                    this.skills.push(generalSkills[i]);
                }
                else {
                    if(this.identity !== 'Lord' && skillInfo['IsBossSkill']) {
                        skillUI.getComponent(cc.Button).interactable = false;
                    }
                    else {
                        this.skills.push(generalSkills[i]);
                    }
                }
                let skillControl = skillUI.getComponent('SkillControl');
                if(skillInfo['launch']) {
                    let func = skillInfo['launch'];
                    func(this, skillControl);
                }
            }
            for(; i < 3; ++i) {
                let skillUI = this.skillBox.children[i];
                skillUI.getComponent(cc.Button).interactable = false;
                cc.find('Name', skillUI).getComponent(cc.Label).string = '';
            }
        }
    },

    setGeneralEquipment(seat, cardInfo, type) {
        if(type)
            this.playerControls[seat].equipments[type] = cardInfo;
        let node = cc.find(type+'/Name', this.players[seat]);
        if(cardInfo === null) node.getComponent(cc.Label).string = "";
        else
            node.getComponent(cc.Label).string = StandardPackage.Cards.get(cardInfo[2])['abbreviation'];
    },
    
    connectTwoGeneral(src, dst) {
        this.fgCtx.moveTo(this.node.x+src.parent.x, this.node.y+src.parent.y);
        this.fgCtx.lineTo(this.node.x+dst.parent.x, this.node.y+dst.parent.y);
        this.fgCtx.stroke();

        this.schedule(() => {
            this.fgCtx.clear();
        }, 1, 1, 2);
    },
    cancelConnect() {
        this.fgCtx.clear();
    },

    doDamage(seat, damage, source) {
        let dst = this.playerControls[seat];
        dst.startShaking();
        this.schedule(() => {
            dst.stopShaking();
        }, 1, 1, 0.5);
        let health = this.playerControls[seat].health - damage;
        this.setGeneralHealth(seat, health);

        if(seat === this.seat) {
            this.lastDamageSource = source;
            if(this.isDead()) {
                this.deathStruggle(source);
            }
            else {
                this.whenHurt();
                socket.send({'event':'responseOne', 'subevent':'youCanContinue', 'to':source});
            }
        }
    },

    doCure(seat, value) {
        let health = this.playerControls[seat].health + value;
        this.setGeneralHealth(seat, health);

        let peach = cc.find('Peach', this.players[seat]);
        let seq = cc.sequence(cc.fadeIn(0.3), cc.fadeOut(0.3));
        peach.runAction(seq);
    },

    playerDead(seat, identity) {
        this.players[seat].getChildByName('Dead').active = true;
        this.setGeneralIdentity(seat, identity);
        this.setGeneralState(this.seat, '');
        this.playerControls[seat].isDead = true;
        if(seat === this.seat) {
            this.banRestoreControl = true;
            for(let skill of this.skillBox.children) {
                let skillControl = skill.getComponent('SkillControl');
                skillControl.enableCount = 0;
                if(this.isMyTurn) {
                    return this.otherPlayersTurn();
                }
            }
        }
    },

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
        this.chosenPlayers = [];
    },

    choosePlayer(player, seat) {
        player.getChildByName('ValidFrame').active = false;
        player.getChildByName('SelectedFrame').active = true;
        player.getComponent('PlayerControl').chooseHandler = () => {};
        this.chosenPlayers.push(seat);
    },
    
    // ***************** Card's opration ***************** 
    
    selfAddCards(cards) {
        let num = cards.length;
        for(let i = 0; i < num; ++i) {
            let card = cc.instantiate(this.cardPrefab);
            this.cardsBox.addChild(card);
            card.x = 30 + 30 * this.self.nCards;
            card.y = 0;
            card.opacity = 0;

            let cardControl = card.getComponent('CardControl');
            cardControl.cardColor = cards[i][0];
            cardControl.cardNumber = cards[i][1];
            cardControl.cardName = cards[i][2];
            cardControl.game = this;
            cardControl.id = this.self.nCards;

            let color = cc.find('Color', card);
            cc.loader.loadRes('Textures/Widgets/Suit/'+cards[i][0], cc.SpriteFrame, function (err, spriteFrame) {
                if(err) {
                    console.log(err);
                }
                else {
                    color.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            });

            let cardNum = cc.find('Number', card);
            if(cards[i][1] == 11) cards[i][1] = 'J';
            if(cards[i][1] == 12) cards[i][1] = 'Q';
            if(cards[i][1] == 13) cards[i][1] = 'K';
            cardNum.getComponent(cc.Label).string = cards[i][1];

            cc.loader.loadRes('Textures/Cards/'+cards[i][2], cc.SpriteFrame, function (err, spriteFrame) {
                if(err) {
                    console.log(err);
                }
                else {
                    card.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    let action = cc.fadeIn(0.5);
                    card.runAction(action);
                }
            });
            
            // set card handler
            if(this.phase !== 'ready') {
                let cardHandler = StandardPackage.Cards.get(cardControl.cardName)[this.phase];
                cardHandler(this, cardControl);
            }

            ++this.self.nCards;
        }
        this.setGeneralCardsCount(this.seat, this.self.nCards);
        this.cardsBox.width = this.self.nCards * 30 + 30;
    },

    selfRemoveCards(cards) {
        for(let card of cards) {
            card.getComponent('CardControl').cardDownAtion();
            card.removeFromParent(true);
            --this.self.nCards;
        }
    },

    selfSortCards() {
        let cards = this.cardsBox.children;
        for(let i = 0; i < this.self.nCards; ++i) {
            let card = cards[i];
            let cardControl = card.getComponent('CardControl');
            cardControl.id = i;
            // card.x = 30 + 30 * i;
            // card.y = 0;
            let toPos = cc.p(30 + 30 * i, 0);
            let action = cc.moveTo(0.5, toPos);
            card.runAction(action);
        }
        this.cardsBox.width = this.self.nCards * 30 + 30;
    },

    chosenCardsDown() {
        let cards = this.cardsBox.children;
        for(let chosenCard of this.chosenCards) {
            let card = cards[chosenCard];
            // card.getComponent('CardControl').cardDownAtion();
            card.getComponent('CardControl').botClick();
        }
    },

    getCardInfo(card) {
        let cardControl = card.getComponent('CardControl');
        return [cardControl.cardColor, cardControl.cardNumber, cardControl.cardName];
    },

    discardChosenCard() {
        let cards = this.cardsBox.children;
        let discards = [], discardInfos = [];
        let n = this.chosenCards.size;
        for(let chosenCard of this.chosenCards) {
            discards.push(cards[chosenCard]);
            discardInfos.push(this.getCardInfo(cards[chosenCard]));
        }
        this.selfRemoveCards(discards);
        this.sendToDiscardPile(discardInfos);
        this.selfSortCards();

        this.setGeneralCardsCount(this.seat, this.self.nCards);

        socket.send({'event':'discard', 'count':n, 'cards':discardInfos});
    },

    selfDiscard() {
        this.chosenCardsDown();
        if(this.self.nCards - this.self.health <= 0) {
            return this.otherPlayersTurn();
        }
        this.onChosenCardsChange = () => {
            if(this.chosenCards.size === this.self.nCards - this.self.health) {
                this.confirmButton.active = true;
                this.confirmHandler = () => {
                    this.confirmButton.active = false;
                    this.discardChosenCard();

                    this.onChosenCardsChange = () => {
                        console.log('onChosenCardsChange');
                    };

                    return this.otherPlayersTurn();
                }
            }
            else {
                this.confirmButton.active = false;
            }
        };
    },

    sendToDiscardPile(discardInfos) {
        if(discardInfos.length >= 5) {
            while(discardInfos.length > 5) discardInfos.shift();
        }
        let i = 0;
        let children = this.discardPile.children, 
            nChildren = children.length;
        for(i = 0; i < nChildren + discardInfos.length - 5; ++i) {
            children[0].removeFromParent(true);
        }
        for(i = 0; i < children.length; ++i) {
            let toPos = cc.p(-240 + 120 * i, 0);
            let action = cc.moveTo(0.5, toPos);
            children[i].runAction(action);
            cc.find('Last', children[i]).active = false;
        }
        for(let discardInfo of discardInfos) {
            let discard = cc.instantiate(this.discardPrefab);
            this.discardPile.addChild(discard);
            discard.x = -240 + 120 * i;
            discard.y = 0;
            discard.opacity = 0;

            ++i;

            let color = cc.find('Color', discard);
            cc.loader.loadRes('Textures/Widgets/Suit/'+discardInfo[0], cc.SpriteFrame, function (err, spriteFrame) {
                if(err) {
                    console.log(err);
                }
                else {
                    color.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            });

            let cardNum = cc.find('Number', discard);
            if(discardInfo[1] == 11) discardInfo[1] = 'J';
            if(discardInfo[1] == 12) discardInfo[1] = 'Q';
            if(discardInfo[1] == 13) discardInfo[1] = 'K';
            cardNum.getComponent(cc.Label).string = discardInfo[1];

            cc.loader.loadRes('Textures/Cards/'+discardInfo[2], cc.SpriteFrame, function (err, spriteFrame) {
                if(err) {
                    console.log(err);
                }
                else {
                    discard.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    let action = cc.fadeIn(0.5);
                    discard.runAction(action);
                }
            });
        }
    },

    chosenCardsMeetRequest(reqCards) {
        let chosenCards = Array.from(this.chosenCards);
        if(chosenCards.length !== reqCards.length) return false;
        let cards = this.cardsBox.children;
        for(let i = 0; i < reqCards.length; ++i) {
            let cardInfo = this.getCardInfo(cards[chosenCards[i]]);
            for(let j = 0; j < 3; ++j) {
                if(!reqCards[i][j]) continue;
                if(reqCards[i][j] !== cardInfo[j]) return false;
            }
        }
        return true;
    },

    chosenCardsPartiallyMeetRequest(reqCard, count) {
        let chosenCards = Array.from(this.chosenCards);
        if(chosenCards.length > count || chosenCards.length === 0) 
            return false;
        let cards = this.cardsBox.children;
        for(let i = 0; i < chosenCards.length; ++i) {
            let cardInfo = this.getCardInfo(cards[chosenCards[i]]);
            for(let j = 0; j < 3; ++j) {
                if(!reqCard[j]) continue;
                if(reqCard[j] !== cardInfo[j]) return false;
            }
        }
        return true;
    },

    activeEndPlayButton() {
        if(this.isMyTurn) {
            this.endPlayButton.active = true;
        }
    },

    // event
    onChosenCardsChange() {
        console.log('onChosenCardsChange');
    },

    // ***************** Register Handlers ***************** 

    registerPlayerEnter() {
        socket.addHandler('playerEnter', (data) => {
            this.setGeneralAvatar(data.seat, "Textures/Characters/Unknown");
            this.setGeneralState(data.seat, '准备');
            ++this.nPlayers;
            if(this.seat === 0 && this.nPlayers === 5) {
                this.startButton.active = true;
            }
        });
    },

    registerPlayerLeave() {
        socket.addHandler('playerLeave', (data) => {
            this.setGeneralAvatar(data.seat, "Textures/Characters/Sola");
            this.setGeneralState(data.seat, '空位');
            --this.nPlayers;
        });
    },

    registerStartGame() {
        socket.addHandler('startGame', (data) => {
            this.identity = data.identity;
            this.lordSeat = data.lordSeat;

            this.setGeneralIdentity(this.seat, data.identity);
            this.setGeneralIdentity(data.lordSeat, 'Lord');
            this.startButton.active = false;
            
            cc.loader.loadRes('Textures/Widgets/Info/'+data.identity, cc.SpriteFrame, function (err, spriteFrame) {
                if(err) {
                    console.log(err);
                }
                else {
                    let node = cc.find('Canvas/Identity');
                    node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    var seq = cc.sequence(cc.fadeIn(1), cc.fadeOut(1));
                    node.runAction(seq);
                }
            });

            for(let i = 0; i < 5; ++i) {
                if(i === data.lordSeat) {
                    this.setGeneralState(data.lordSeat, '正在选将');
                }
                else {
                    this.setGeneralState(i, '等待');
                }
            }

            if(data.identity === 'Lord') {
                socket.send({'event':'getGenerals'});
            }
            this.registerGetGeneral();
            this.registerchoseGeneral();
        });
    },

    registerGetGeneral() {
        socket.addHandler('getGenerals', (data) => {
            this.generalsBox.parent.parent.active = true;
            let i = 0;
            for(let generalName of data.generals) {
                let general = cc.instantiate(this.generalPrefab);
                this.generalsBox.addChild(general);
                general.x = 30 + 50 * i;
                general.y = 0;
                ++i;

                let generalControl = general.getComponent('GeneralControl');
                generalControl.game = this;
                let generalInfo = StandardPackage.Generals.get(generalName);

                // render avatar
                cc.loader.loadRes('Textures/Characters/'+generalName, cc.SpriteFrame, function (err, spriteFrame) {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        general.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    }
                });

                // render frame
                cc.loader.loadRes('Textures/Widgets/Frames/'+generalInfo['Camp'], cc.SpriteFrame, function (err, spriteFrame) {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        let generalFrameUI = cc.find('Frame', general);
                        generalFrameUI.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    }
                });

                // render chinese name
                let generalNameUI = cc.find('Name', general);
                let nameString = '<outline color=black width=3>', 
                    generalCName = generalInfo['ChineseName'];
                for(let c of generalCName) {
                    nameString += c + '<br/>';
                }
                nameString += '</outline>';
                generalNameUI.getComponent(cc.RichText).string = nameString;

                // render bloods
                let generalHealthUI = cc.find('Bloods', general),
                    generalHealth = generalInfo['Health'];
                for(let i = 0; i < generalHealth; ++i) {
                    generalHealthUI.children[i].active = true;
                }

                // render skill intro
                let generalSkillInfoUI = cc.find('Skills/SkillInfo', general),
                    generalSkillInfo = ''
                for(let skillName of generalInfo['Skills']) {
                    let intro = StandardPackage.Skills.get(skillName)['Intro'];
                    generalSkillInfo += intro + '\n';
                }
                generalSkillInfoUI.getComponent(cc.Label).string = generalSkillInfo;

                // register chosen handler
                generalControl.ondoubleclick = () => {
                    this.setGeneralAfterChosen(this.seat, generalName);
                    this.generalsBox.parent.parent.active = false;

                    socket.send({'event':'choseGeneral', 'general':generalName});
                    this.registerStartFight();
                };
            }
            this.generalsBox.width = data.generals.length * 50 + 30;
        });
    },

    registerchoseGeneral() {
        socket.addHandler('choseGeneral', (data) => {
            this.setGeneralAfterChosen(data.seat, data.general);
        });
    },

    registerStartFight() {
        socket.addHandler('startFight', (data) => {
            // let num = this.cardsBox.children.length;
            // for(let i = 0; i < num; ++i) {
            //     this.selfRemoveCard(this.cardsBox.children[0]);
            // }
            this.self.nCards = 0;
            this.selfAddCards(data.cards);
            for(let i = 0; i < 5; ++i) {
                this.setGeneralCardsCount(i, 4);

                this.setGeneralEquipment(i, null, 'Weapon');
                this.setGeneralEquipment(i, null, 'Armor');
                this.setGeneralEquipment(i, null, 'HorsePlusOne');
                this.setGeneralEquipment(i, null, 'HorseSubOne');
            }
            socket.clearHandlers();
            cc.find('Canvas/GoBack').active = false;
            this.registerOtherChangeState();
            this.registerOtherDrawCards();
            this.registerYourTurn();
            this.registerOtherDiscard();
            this.registerDrawCards();
            this.registerRequestCards();
            this.registerRequestCertainAmountOfCards();
            this.registerRequestCardsForcibly();
            this.registerSomebodyHurt();
            this.registerSomebodyCure();
            this.registerGrabControl();
            this.registerRestoreControl();
            this.registerPlayerDead();
            this.registerEquip();
            this.registerMakeAChoice();
            this.registerGameOver();
            this.registerUpdateDiscard();
            this.registerYouCanContinue();
            this.registerAskContinue();
            this.registerKickCards();
            this.registerSendCardsTo();
            this.registerOrderOneKillOther();
            this.registerEveryoneGetCard();
            this.registerYouChooseOne();
            this.registerIChooseOne();
            this.registerSelectCardFinish();
            this.registerLaunchDelayMagic();
            this.registerCancelDelayMagic();
            if(this.identity === 'Lord') {
                this.judgePhase();
            }
        });
    },

    registerOtherChangeState() {
        socket.addHandler('otherChangeState', (data) => {
            this.setGeneralState(data.seat, data.state);
        });
    },

    registerOtherDrawCards() {
        socket.addHandler('otherDrawCards', (data) => {
            let nCards = this.playerControls[data.seat].nCards + data.count;
            this.setGeneralCardsCount(data.seat, nCards);
        });
    },

    registerDrawCards() {
        socket.addHandler('drawCards', (data) => {
            this.selfAddCards(data.cards);
            if(data.turnPlay) {
                this.playPhase();
            }
        });
    }, 

    registerOtherDiscard() {
        socket.addHandler('otherDiscard', (data) => {
            let nCards = this.playerControls[data.seat].nCards - data.count;
            this.setGeneralCardsCount(data.seat, nCards);
            this.sendToDiscardPile(data.cards);
        });
    },

    registerYourTurn() {
        socket.addHandler('yourTurn', (data) => {
            this.judgePhase();
        });
    },
    
    registerRequestCards() {
        socket.addHandler('requestCards', (data) => {
            let target = data.to;
            this.connectTwoGeneral(this.players[data.from], this.players[target]);
            if(target === this.seat) {
                this.grabControl();
                let cards = data.cards;
                let acceptHandler = () => {
                    this.confirmButton.active = false;
                    this.cancelButton.active = false;
                    this.armorControl.enableCount = 0;

                    socket.send({
                        'event':'responseOne', 
                        'subevent':'acceptRequest', 
                        'to':data.from,
                        'data':null,
                    });

                    this.onChosenCardsChange = () => {
                        console.log('onChosenCardsChange');
                    };
                };
                if(this.allRequestsAreJink(cards)) {
                    if(!data.ignoreArmor && this.armorControl.hasEquiped) {
                        this.armorControl.enableCount = cards.length;
                        this.armorControl.requestCards = cards;
                        this.armorControl.allMeetHandler = acceptHandler;
                    }
                }
                this.onChosenCardsChange = () => {
                    if(this.chosenCardsMeetRequest(cards)) {
                        this.confirmButton.active = true;
                        this.confirmHandler = () => {
                            this.discardChosenCard();
                            acceptHandler();
                        }
                    }
                    else {
                        this.confirmButton.active = false;
                    }
                };
                this.cancelButton.active = true;
                this.cancelHandler = () => {
                    this.confirmButton.active = false;
                    this.cancelButton.active = false;
                    this.armorControl.enableCount = 0;

                    this.onChosenCardsChange = () => {
                        console.log('onChosenCardsChange');
                    };

                    socket.send({
                        'event':'responseOne', 
                        'subevent':'rejectRequest', 
                        'to':data.from
                    });
                }
            }
        });
    },

    registerRequestCertainAmountOfCards() {
        socket.addHandler('requestCertainAmountOfCards', (data) => {
            let target = data.to;
            this.connectTwoGeneral(this.players[data.from], this.players[target]);
            if(target === this.seat) {
                this.grabControl();
                // if(data.card[2] === 'WUXIEKEJI' && !this.hasCard([null, null, 'WUXIEKEJI'])) {
                //     socket.send({
                //         'event':'responseOne', 
                //         'subevent':'rejectRequest', 
                //         'to':data.from
                //     });
                //     return;
                // }
                this.onChosenCardsChange = () => {
                    if(this.chosenCardsPartiallyMeetRequest(data.card, data.count)) {
                        this.confirmButton.active = true;
                        this.confirmHandler = () => {
                            this.confirmButton.active = false;
                            this.cancelButton.active = false;

                            let count = this.chosenCards.size;
                            this.discardChosenCard();

                            if(data.card[2] === 'WUXIEKEJI') {
                                this.whenMagicLaunch();
                                let alives = this.getAlivePlayers(this.seat);
                                let wuxie = [null, null, 'WUXIEKEJI'];
                                socket.saveHandler('acceptRequest');
                                socket.saveHandler('rejectRequest');
                                this.requestCertainAmountOfCards(wuxie, 1, alives,
                                    () => {
                                        socket.restoreHandler('acceptRequest');
                                        socket.restoreHandler('rejectRequest');
                                        socket.send({
                                            'event':'responseOne', 
                                            'subevent':'rejectRequest', 
                                            'to':data.from
                                        });
                                    },
                                    () => {
                                        socket.restoreHandler('acceptRequest');
                                        socket.restoreHandler('rejectRequest');
                                        socket.send({
                                            'event':'responseOne', 
                                            'subevent':'acceptRequest', 
                                            'to':data.from,
                                            'data':{'count':count},
                                        });
                                    }
                                );
                            }
                            else {
                                socket.send({
                                    'event':'responseOne', 
                                    'subevent':'acceptRequest', 
                                    'to':data.from,
                                    'data':{'count':count},
                                });
                            }

                            this.onChosenCardsChange = () => {
                                console.log('onChosenCardsChange');
                            };
                        }
                    }
                    else {
                        this.confirmButton.active = false;
                    }
                };
                this.cancelButton.active = true;
                this.cancelHandler = () => {
                    this.confirmButton.active = false;
                    this.cancelButton.active = false;
                    this.onChosenCardsChange = () => {
                        console.log('onChosenCardsChange');
                    };

                    socket.send({
                        'event':'responseOne', 
                        'subevent':'rejectRequest', 
                        'to':data.from
                    });
                }
            }
        });
    },

    registerRequestCardsForcibly() {
        socket.addHandler('requestCardsForcibly', (data) => {
            let target = data.to;
            this.connectTwoGeneral(this.players[data.from], this.players[target]);
            if(target === this.seat) {
                this.grabControl();
                this.onChosenCardsChange = () => {
                    if(this.chosenCardsMeetRequest(data.cards)) {
                        this.confirmButton.active = true;
                        this.confirmHandler = () => {
                            this.confirmButton.active = false;

                            this.discardChosenCard();

                            this.onChosenCardsChange = () => {
                                console.log('onChosenCardsChange');
                            };

                            this.restoreControl();
                        }
                    }
                    else {
                        this.confirmButton.active = false;
                    }
                };
            }
        });
    },

    registerSomebodyHurt() {
        socket.addHandler('somebodyHurt', (data) => {
            for(let victim of data.to) {
                this.doDamage(victim, data.damage, data.from);
            }
        });
    },

    registerSomebodyCure() {
        socket.addHandler('somebodyCure', (data) => {
            for(let to of data.data.to) {
                this.doCure(to, data.data.value);
            }
        });
    },

    registerGrabControl() {
        socket.addHandler('grabControl', (data) => {
            this.confirmButton.active = false;
            this.endPlayButton.active = false;
            this.changePhase('wait');
        });
    },
    registerRestoreControl() {
        socket.addHandler('restoreControl', (data) => {
            this.activeEndPlayButton();
            this.changePhase('play');
        });
    },

    registerPlayerDead() {
        socket.addHandler('playerDead', (data) => {
            let seat = data.from, murderer = data.murderer;
            this.playerDead(seat, data.identity);

            if(murderer === this.seat) {
                if(this.identity === 'Lord' && data.identity === 'Loyalty') {
                    this.chosenCardsDown();
                    for(let card of this.cardsBox.children) {
                        let cardControl = card.getComponent('CardControl');
                        cardControl.cardUpAction();
                    }
                    this.discardChosenCard();
                }
                else if(data.identity === 'Rebel') {
                    socket.send({'event':'drawCards', 'count':3});
                }
            }
        });
    },

    registerEquip() {
        socket.addHandler('equip', (data) => {
            this.setGeneralEquipment(data.from, data.data.cardInfo, data.data.type);
            if(data.data.type === 'HorsePlusOne') {
                this.playerControls[data.from].plusDistance = 1;
            }
            else if(data.data.type === 'HorseSubOne') {
                this.playerControls[data.from].subDistance = 1;
            }
        });
    },

    registerMakeAChoice() {
        socket.addHandler('makeAChoice', (data) => {
            let setButton1 = (text) => {
                this.confirmButton.getChildByName('Label').getComponent(cc.Label).string = text;
            }
            let setButton2 = (text) => {
                this.cancelButton.getChildByName('Label').getComponent(cc.Label).string = text;
            }
            this.grabControl();
            if(data.data.option1) {
                this.confirmButton.active = true;
                setButton1(data.data.option1);

                this.confirmHandler = () => {
                    setButton1('确认');
                    setButton2('取消');
                    this.confirmButton.active = false;
                    this.cancelButton.active = false;
                    socket.send({'event':'responseOne', 'subevent':'choose1', 'to':data.from});
                    this.confirmHandler = () => {};
                    this.cancelHandler = () => {};
                    this.restoreControl();
                };
            }
            if(data.data.option2) {
                this.cancelButton.active = true;
    
                setButton2(data.data.option2);
    
                this.cancelHandler = () => {
                    setButton1('确认');
                    setButton2('取消');
                    this.confirmButton.active = false;
                    this.cancelButton.active = false;
                    socket.send({'event':'responseOne', 'subevent':'choose2', 'to':data.from});
                    this.confirmHandler = () => {};
                    this.cancelHandler = () => {};
                    this.restoreControl();
                };
            }
        });
    },

    registerGameOver() {
        socket.addHandler('gameOver', (data) => {
            this.gameOver(data.winner);
        });
    },

    registerUpdateDiscard() {
        socket.addHandler('updateDiscard', (data) => {
            this.sendToDiscardPile(data.data.cards);
        });
    },

    registerYouCanContinue() {
        socket.addHandler('youCanContinue', (data) => {
            this.restoreControl();
        });
    },

    registerAskContinue() {
        socket.addHandler('askContinue', (data) => {
            if(!this.banResponseContinue) {
                socket.send({'event':'responseOne', 'subevent':'youCanContinue', 'to':data.from});
            }
        });
    },

    registerKickCards() {
        socket.addHandler('kickCards', (data) => {
            if(data.data.grab) {
                let sendCards = [], handCards = [];
                let cards = this.cardsBox.children, k = 0;
                for(let id of data.data.cards) {
                    if(typeof id === 'string') {
                        let cardInfo = this.self.equipments[id];
                        sendCards.push(cardInfo);
                        this.unloadEquipment(id, false);
                    }
                    else {
                        let cardInfo = this.getCardInfo(cards[id]);
                        sendCards.push(cardInfo);
                        handCards.push(cards[id]);
                        ++k;
                    }
                }
                for(let handCard of handCards) {
                    handCard.removeFromParent(true);
                    --this.self.nCards;
                }
                this.selfSortCards();
                this.setGeneralCardsCount(this.seat, this.self.nCards);
                this.setGeneralCardsCount(data.from, this.playerControls[data.from].nCards+k);
                this.sendCardsTo(sendCards, data.from);
            }
            else {
                let cards = this.cardsBox.children;
                let hasHandCards = false;
                for(let id of data.data.cards) {
                    if(typeof id === 'string') {
                        this.unloadEquipment(id);
                    }
                    else {
                        hasHandCards = true;
                        let cardControl = cards[id].getComponent('CardControl');
                        cardControl.botClick();
                    }
                }
                if(hasHandCards) {
                    this.discardChosenCard();
                }
            }
        });
    },

    registerSendCardsTo() {
        socket.addHandler('sendCardsTo', (data) => {
            let to = data.data.to, from = data.from;
            this.setGeneralCardsCount(from, data.data.nRestCards);
            if(this.seat === to) {
                this.selfAddCards(data.data.cards);
            }
            else {
                let nCards = this.playerControls[to].nCards + data.data.cards.length;
                this.setGeneralCardsCount(to, nCards);
            }
        });
    },

    registerOrderOneKillOther() {
        socket.addHandler('orderOneKillOther', (data) => {
            let killer = data.data.killer, killed = data.data.killed;
            if(this.seat === killer) {
                let recover = () => {
                    socket.send({
                        'event':'responseOne', 
                        'subevent':'youCanContinue', 
                        'to':data.from
                    });
                    this.changePhase('wait');
                }
                this.canKillPlayer = killed;
                this.playSpecifiedCard([null, null, 'SHA'], () => {
                    let cardInfo = this.self.equipments['Weapon'];
                    this.unloadEquipment('Weapon', false);
                    this.sendCardsTo([cardInfo], data.from);
                    recover();
                });
                socket.addHandler('youCanContinue', (data) => {
                    recover();
                    this.registerYouCanContinue();
                });
            }
        });
    },

    registerEveryoneGetCard() {
        socket.addHandler('everyoneGetCard', (data) => {
            this.everyoneGetCard(data.data.cards);
        });
    },

    registerYouChooseOne() {
        socket.addHandler('youChooseOne', (data) => {
            for(let card of this.selectableCardsBox.children) {
                let control = card.getComponent('SelectableCardControl');
                control.enable = true;
            }
            this.selectedCount = 1;
            this.selectCardsFinish = () => {
                for(let card of this.selectableCardsBox.children) {
                    let control = card.getComponent('SelectableCardControl');
                    control.enable = false;
                }
                let cardId = Array.from(this.selectedOthersCards)[0];
                let card = this.selectableCardsBox.children[cardId];
                card.active = false;
                let control = card.getComponent('SelectableCardControl');
                let cardInfo = control.cardInfo;
                this.selfAddCards([cardInfo]);
                socket.send({
                    'event':'broadcast',
                    'subevent':'iChooseOne',
                    'data':{'cardId':cardId}
                });
                socket.send({
                    'event':'responseOne', 
                    'subevent':'youCanContinue', 
                    'to':data.from
                });
            };
        });
    },
    registerIChooseOne() {
        socket.addHandler('iChooseOne', (data) => {
            let nCards = this.playerControls[data.from].nCards + 1;
            this.setGeneralCardsCount(data.from, nCards);

            let card = this.selectableCardsBox.children[data.data.cardId];
            card.active = false;
        });
    },
    registerSelectCardFinish() {
        socket.addHandler('selectCardFinish', (data) => {
            this.disactiveSelectableCardsBox();
        });
    },

    registerLaunchDelayMagic() {
        socket.addHandler('launchDelayMagic', (data) => {
            let name = data.data.name, seat = data.data.to;
            this.addJudge(seat, name);
        });
    },
    registerCancelDelayMagic() {
        socket.addHandler('cancelDelayMagic', (data) => {
            let name = data.data.name, seat = data.data.to;
            this.removeJudge(seat, name);
        });
    },

    // ***************** Button Event ***************** 
    backToHall() {
        socket.send({'event':'leaveRoom'});
        cc.director.loadScene('Hall');
    },

    startGame() {
        socket.send({'event':'startGame'});
    },

    endPlayCard() {
        this.endPlayButton.active = false;
        this.discardPhase();
    },

    confirmOperation() {
        this.confirmHandler();
    },
    confirmHandler() {
        console.log('confirm');
    },

    cancelOperation() {
        this.cancelHandler();
    },
    cancelHandler() {
        console.log('cancel');
    },

    // ***************** Request Cards *****************  
    // Ask a person to play a number of specific cards, such as 杀出闪、决斗出杀
    requestCards(cards, to, acceptHandler, rejectHandler) {
        this.connectTwoGeneral(this.players[this.seat], this.players[to]);
        let data = {'event':'requestCards', 'to':to, 'cards':cards};
        data = this.deorateRequestCardsData(data);
        socket.send(data);
        socket.addHandler('acceptRequest', acceptHandler);
        socket.addHandler('rejectRequest', rejectHandler);
    },

    // Ask everyone to get enough n specific cards, such as 求逃、主公求闪
    requestCertainAmountOfCards(card, count, to, meetHandler, unmetHandler) {
        if(to.length === 0) {
            unmetHandler();
            return;
        }
        let next = to.shift();
        socket.send({'event':'requestCertainAmountOfCards', 'to':next, 'card':card, 'count':count});
        socket.addHandler('acceptRequest', (data) => {
            if(data.data.count >= count) {
                meetHandler();
            }
            else {
                this.requestCertainAmountOfCards(card, count-data.data.count, to, meetHandler, unmetHandler);
            }
        });
        socket.addHandler('rejectRequest', (data) => {
            this.requestCertainAmountOfCards(card, count, to, meetHandler, unmetHandler);
        });
    },

    // Ask everyone to play a number of specific card, such as 万箭齐发、南蛮入侵
    requestCardsForMultiPlayers(cards, to, acceptHandler, rejectHandler) {
        if(to.length === 0) {
            this.activeEndPlayButton();
            this.registerYouCanContinue();
            this.banRestoreControl = false;
            this.restoreControl();
            return;
        }
        let next = to.shift();
        this.connectTwoGeneral(this.players[this.seat], this.players[next]);
        socket.send({'event':'requestCards', 'to':next, 'cards':cards});
        this.banRestoreControl = true;
        socket.addHandler('acceptRequest', (data) => {
            acceptHandler(next);
        });
        socket.addHandler('rejectRequest', (data) => {
            rejectHandler(next);
        });
        socket.addHandler('youCanContinue', (data) => {
            this.requestCardsForMultiPlayers(cards, to, acceptHandler, rejectHandler);
        });
    },

    requestCardsForcibly(cards, to) {
        this.connectTwoGeneral(this.players[this.seat], this.players[to]);
        socket.send({'event':'requestCardsForcibly', 'to':to, 'cards':cards});
    },

    // ***************** Give Some Options ***************** 
    giveTwoOptions(seat, option1, option2, option1handler, option2handler) {
        socket.send({
            'event':'responseOne', 
            'subevent':'makeAChoice', 
            'to': seat,
            'data':{'option1':option1, 'option2':option2}
        });
        socket.addHandler('choose1', (data) => {
            option1handler();
        });
        socket.addHandler('choose2', (data) => {
            option2handler();
        });
    },

    // ***************** Helper ***************** 
    getDistance(from, to) {
        if(from.seat === to.seat) return 0;
        if(to.isDead) return 100;
        let n = 5;
        let leftDis = 0, rightDis = 0, idx = from.seat;
        while(idx != to.seat) {
            idx = (idx + 1) % n;
            if(this.playerControls[idx].isDead) continue;
            ++rightDis;
        }
        idx = from.seat;
        while(idx != to.seat) {
            idx = (idx - 1 + n) % n;
            if(this.playerControls[idx].isDead) continue;
            ++leftDis;
        }
        let res = Math.min(leftDis, rightDis) - from.subDistance + to.plusDistance;
        if(StandardPackage.Generals.get(from.generalName)['subDistance']) {
            res -= StandardPackage.Generals.get(from.generalName)['subDistance'];
        }
        return res;
    },

    getWeaponDistance() {
        return this.self.weaponDistance;
    },
    getMagicDistance() {
        return this.self.magicDistance;
    },

    damageOthers(victim, damage, source) {
        let from = this.seat;
        if(source) from = source;
        socket.send({'event':'damageOthers', 'from': from, 'to':victim, 'damage':damage});
        for(let v of victim) {
            this.doDamage(v, damage, from);
        }
    },

    isDead() {
        if(this.self.health <= 0) return true;
        else return false;
    },

    curePlayers(seats, value) {
        for(let seat of seats) {
            this.doCure(seat, value);
        }
        socket.send({
            'event':'broadcast', 
            'subevent':'somebodyCure',
            'data':{'to':seats, 'value':value},
        });
    },

    getAlivePlayers(seat) {
        let res = [];
        let idx = (seat + 1) % this.players.length;
        for(let i = 0; i < this.players.length; ++i) {
            if(!this.playerControls[idx].isDead) {
                res.push(this.playerControls[idx].seat);
            }
            idx = (idx + 1) % this.players.length;
        }
        return res;
    },

    getAlivePlayersWithoutSelf(seat) {
        let res = [];
        let idx = (seat + 1) % this.players.length;
        for(let i = 0; i < this.players.length-1; ++i) {
            if(!this.playerControls[idx].isDead) {
                res.push(this.playerControls[idx].seat);
            }
            idx = (idx + 1) % this.players.length;
        }
        return res;
    },

    deathStruggle(murderer) {
        socket.send({'event':'changeState', 'state':'求救'});
        this.grabControl();
        let alives = this.getAlivePlayers(this.seat),
            nPeaches = 1 - this.self.health;
        let peach = [null, null, 'TAO'];
        this.requestCertainAmountOfCards(peach, nPeaches, alives,
            () => {
                socket.send({'event':'changeState', 'state':''});
                this.curePlayers([this.seat], nPeaches);
                socket.send({'event':'responseOne', 'subevent':'youCanContinue', 'to':murderer});
            },
            () => {
                socket.send({'event':'changeState', 'state':''});
                socket.send({'event':'iamDead', 'murderer':murderer});
                this.playerDead(this.seat, this.identity);
                socket.send({'event':'responseOne', 'subevent':'youCanContinue', 'to':murderer});
            }
        );
    },

    grabControl() {
        if(this.isMyTurn) {
            this.confirmButton.active = false;
            this.endPlayButton.active = false;
            this.changePhase('wait');
        }
        else {
            socket.send({'event':'grabControl'});
        }
    },
    restoreControl() {
        if(this.banRestoreControl) return;
        if(this.isMyTurn) {
            this.activeEndPlayButton();
            this.changePhase('play');
        }
        else {
            socket.send({'event':'restoreControl'});
        }
    },

    // equip() must be in front of card's handler
    equip(cardControl, type) {
        if(this.self.equipments[type] !== null) {
            let curEquipment = this.self.equipments[type][2];
            let func = StandardPackage.Cards.get(curEquipment)['unload'];
            func(this);

            this.afterUnloadEquipment();
        }
        let cardInfo = [cardControl.cardColor, cardControl.cardNumber, cardControl.cardName];
        this.setGeneralEquipment(this.seat, cardInfo, type);
        socket.send({
            'event':'broadcast', 
            'subevent':'equip', 
            'data':{'cardInfo':cardInfo, 'type':type}
        });
    },

    getNMaxKills() {
        return this.nMaxKills;
    },

    unloadEquipment(type, isSentToDiscardPile=true) {
        if(this.self.equipments[type] !== null) {
            let curEquipment = this.self.equipments[type][2];
            if(isSentToDiscardPile) {
                this.sendToDiscardPile([this.self.equipments[type]]);
                socket.send({
                    'event':'broadcast', 
                    'subevent':'updateDiscard', 
                    'data':{'cards':[this.self.equipments[type]]}
                });
            }
            let func = StandardPackage.Cards.get(curEquipment)['unload'];
            func(this);

            this.afterUnloadEquipment();
        }
        this.setGeneralEquipment(this.seat, null, type);
        socket.send({
            'event':'broadcast', 
            'subevent':'equip', 
            'data':{'cardInfo':null, 'type':type}
        });
    },

    afterKillSucceeded(seat) {
        this.afterKillSucceededDefault(seat);
    },
    afterKillFailed(seat) {
        this.afterKillFailedDefault(seat);
    },
    afterKillSucceededDefault(seat) {
        this.damageOthers([seat], 1, this.seat);
    },
    afterKillFailedDefault(seat) {
        socket.send({'event':'responseOne', 'subevent':'askContinue', 'to':seat});
    },

    allRequestsAreJink(cards) {
        for(let card of cards) {
            if(card[2] !== 'SHAN') return false;
        }
        return true;
    },

    judge(success, successHandler, failHandler) {
        socket.send({'event':'getCards', 'count':1});
        socket.addHandler('getCards', (data) => {
            this.sendToDiscardPile(data.cards);
            socket.send({
                'event':'broadcast', 
                'subevent':'updateDiscard', 
                'data':{'cards':data.cards}
            });
            if(success(data.cards)) {
                successHandler();
            }
            else {
                failHandler();
            }
            socket.deleteHandler('getCards');
        });
    },

    deorateRequestCardsData(data) {
        return data;
    },

    playSpecifiedCard(specifiedCard, onCancel, changeCardHandler=null) {
        this.confirmButton.active = false;
        this.cancelButton.active = true;
        
        this.chosenCardsDown();
        this.onChosenCardsChange = () => {
            if(this.chosenCards.size >= 2) {
                this.chosenCardsDown();
            }
        };
        for(let card of this.cardsBox.children) {
            let cardControl = card.getComponent('CardControl');
            let cardInfo = [cardControl.cardColor, cardControl.cardNumber, cardControl.cardName];
            let cardHandler = StandardPackage.Cards.get(cardControl.cardName)['play'];
            if(changeCardHandler) {
                cardHandler = changeCardHandler;
            }
            if((specifiedCard[0] && specifiedCard[0] !== cardControl.cardColor)
              || (specifiedCard[1] && specifiedCard[1] !== cardControl.cardNumber)
              || (specifiedCard[2] && specifiedCard[2] !== cardControl.cardName)) {
                cardHandler = StandardPackage.Cards.get(cardControl.cardName)['wait'];
            }
            cardHandler(this, cardControl);
        }

        this.cancelHandler = () => {
            this.confirmButton.active = false;
            this.cancelButton.active = false;
            onCancel();
            if(this.isMyTurn) {
                this.changePhase('play');
            }
            else {
                this.changePhase('wait');
            }
        }
    },

    discardToRealize(count, accpetHandler, rejectHandler) {
        this.confirmButton.active = false;
        this.cancelButton.active = true;
        
        this.changePhase('wait');
        this.onChosenCardsChange = () => {
            if(this.chosenCards.size === count) {
                this.confirmButton.active = true;
                this.confirmHandler = () => {
                    this.confirmButton.active = false;
                    this.cancelButton.active = false;
                    this.discardChosenCard();
                    this.changePhase('play');
                    accpetHandler();
                };
            }
            else {
                this.confirmButton.active = false; 
            }
        };

        this.cancelHandler = () => {
            this.confirmButton.active = false;
            this.cancelButton.active = false;
            this.changePhase('play');
            rejectHandler();
        }
    },

    operateOthersCards(seat, handCardsEnabled, weaponEnabled, armorEnabled, horseEnabled) {
        while(this.selectableCardsBox.children.length > 0) {
            this.selectableCardsBox.children[0].removeFromParent(true);
        }
        this.selectedOthersCards.clear();
        this.selectableCardsBox.parent.parent.active = true;
        let i = 0,
            nHandCards = this.playerControls[seat].nCards;
        this.selectableCardsBox.width = 0;
        let addSelectableCard = (name, id, color=null, number=null) => {
            let card = cc.instantiate(this.selectableCardPrefab);
            this.selectableCardsBox.addChild(card);
            card.x = 30 + 50 * i;
            card.y = 0;
            ++i;
            
            let selectableCardControl = card.getComponent('SelectableCardControl');
            selectableCardControl.game = this;
            selectableCardControl.id = id;

            cc.loader.loadRes('Textures/Cards/'+name, cc.SpriteFrame, function (err, spriteFrame) {
                if(err) {
                    console.log(err);
                }
                else {
                    card.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            });

            if(color) {
                let cardColor = cc.find('Color', card);
                cc.loader.loadRes('Textures/Widgets/Suit/'+color, cc.SpriteFrame, function (err, spriteFrame) {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        cardColor.active = true;
                        cardColor.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    }
                });
            }
            if(number) {
                let cardNum = cc.find('Number', card);
                if(number == 11) number = 'J';
                if(number == 12) number = 'Q';
                if(number == 13) number = 'K';
                cardNum.getComponent(cc.Label).string = number;
                cardNum.active = true;
            }

            return card;
        };
        if(handCardsEnabled) {
            for(let j = 0; j < nHandCards; ++j) {
                let card = addSelectableCard('BEIJING', j);
            }
        }
        let equipments = this.playerControls[seat].equipments;
        if(weaponEnabled && equipments['Weapon']) {
            let card = addSelectableCard(equipments['Weapon'][2], 'Weapon', equipments['Weapon'][0], equipments['Weapon'][1]);
        }
        if(armorEnabled && equipments['Armor']) {
            let card = addSelectableCard(equipments['Armor'][2], 'Armor', equipments['Weapon'][0], equipments['Weapon'][1]);
        }
        if(horseEnabled) {
            if(equipments['HorsePlusOne']) {
                let card = addSelectableCard(equipments['HorsePlusOne'][2], 'HorsePlusOne', equipments['Weapon'][0], equipments['Weapon'][1]);
            }
            if(equipments['HorseSubOne']) {
                let card = addSelectableCard(equipments['HorseSubOne'][2], 'HorseSubOne', equipments['Weapon'][0], equipments['Weapon'][1]);
            }
        }
        this.selectableCardsBox.width += i * 50 + 30;
    },

    onSelectedOthersCardsChange() {
        if(this.selectedOthersCards.size === this.selectedCount 
          || this.selectedOthersCards.size === this.selectableCardsBox.children.length) {
            this.selectCardsFinish();
        }
    },
    selectCardsFinish() {
    },
    disactiveSelectableCardsBox() {
        this.selectableCardsBox.parent.parent.active = false;
    },

    kickCards(seat, grab=false) {
        let cards = Array.from(this.selectedOthersCards);
        socket.send({
            'event':'responseOne', 
            'subevent':'kickCards', 
            'to': seat,
            'data':{'cards':cards,'grab':grab}
        });
    },

    launchMagicCard(launchSucceeded, launchFailed) {
        this.grabControl();
        let alives = this.getAlivePlayers(this.seat);
        let wuxie = [null, null, 'WUXIEKEJI'];
        this.requestCertainAmountOfCards(wuxie, 1, alives,
            () => {
                launchFailed();
            },
            () => {
                launchSucceeded();
            }
        );
    },

    hasCard(searchCardInfo) {
        let cards = this.cardsBox.children;
        let res = false, j = 0;
        for(let card of cards) {
            let cardInfo = this.getCardInfo(card);
            for(j = 0; j < 3; ++j) {
                if(searchCardInfo[j] && searchCardInfo[j] !== cardInfo[j]) 
                    break;
            }
            if(j === 3) return true;
        }
        return false;
    },

    aoe(withoutSelf=true, effectToOne, playerFilter=null, finishHandler=null) {
        let alives;
        if(withoutSelf)
            alives = this.getAlivePlayersWithoutSelf(this.seat);
        else {
            alives = this.getAlivePlayersWithoutSelf(this.seat);
            alives.unshift(this.seat);
        }

        let players = [];
        if(playerFilter) {
            for(let alive of alives) {
                if(playerFilter(alive)) {
                    players.push(alive);
                }
            } 
        }
        else {
            players = alives;
        }

        this.aoeHelper(players, effectToOne, finishHandler);
    },
    aoeHelper(players, effectToOne, finishHandler) {
        if(players.length === 0) {
            this.activeEndPlayButton();
            this.registerYouCanContinue();
            this.banRestoreControl = false;
            this.restoreControl();
            if(finishHandler) {
                finishHandler();
            }
            return;
        }
        let next = players.shift();
        this.banRestoreControl = true;
        effectToOne(next);
        socket.addHandler('youCanContinue', (data) => {
            this.aoeHelper(players, effectToOne, finishHandler);
        });
    },

    sendCardsTo(sendCards, to) {
        socket.send({
            'event':'broadcast', 
            'subevent':'sendCardsTo', 
            'data':{'cards':sendCards, 'to':to, 'nRestCards':this.self.nCards}
        });
    },

    getOthersWeaponDistance(seat) {
        let res = 1;
        if(this.playerControls[seat].equipments['Weapon']) {
            let name = this.playerControls[seat].equipments['Weapon'][2];
            res = StandardPackage.Cards.get(name)['distance'];
        }
        return res;
    },

    getDuelCards(seat=null) {
        if(seat) {
            let n = StandardPackage.Generals.get(this.playerControls[seat].generalName)['nDuelKills'];
            if(n) {
                let cards = [];
                for(let i = 0; i < n ; ++i) {
                    cards.push([null, null, 'SHA']);
                }
            }
        }
        return [[null, null, 'SHA']];
    },
    duel(seat) {
        this.requestCards(this.getDuelCards(this.seat), seat, 
            () => {
                this.onChosenCardsChange = () => {
                    if(this.chosenCardsMeetRequest(this.getDuelCards(seat))) {
                        this.confirmButton.active = true;
                        this.confirmHandler = () => {
                            this.discardChosenCard();
                            this.confirmButton.active = false;
                            this.cancelButton.active = false;
                            this.onChosenCardsChange = () => {};
                            this.duel(seat);
                        }
                    }
                    else {
                        this.confirmButton.active = false;
                    }
                };
                this.cancelButton.active = true;
                this.cancelHandler = () => {
                    this.confirmButton.active = false;
                    this.cancelButton.active = false;
                    this.onChosenCardsChange = () => {};
                    this.damageOthers([this.seat], 1, seat);
                }
            }, 
            () => {
                this.damageOthers([seat], 1, this.seat);
            }
        );
    },
    
    everyoneGetCard(cards) {
        while(this.selectableCardsBox.children.length > 0) {
            this.selectableCardsBox.children[0].removeFromParent(true);
        }
        this.selectableCardsBox.parent.parent.active = true;
        let i = 0;
        this.selectableCardsBox.width = 0;
        let addSelectableCard = (cardInfo) => {
            let card = cc.instantiate(this.selectableCardPrefab);
            this.selectableCardsBox.addChild(card);
            card.x = 30 + 50 * i;
            card.y = 0;
            
            let selectableCardControl = card.getComponent('SelectableCardControl');
            selectableCardControl.game = this;
            selectableCardControl.id = i;
            selectableCardControl.cardInfo = cardInfo;

            ++i;

            cc.loader.loadRes('Textures/Cards/'+cardInfo[2], cc.SpriteFrame, function (err, spriteFrame) {
                if(err) {
                    console.log(err);
                }
                else {
                    card.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            });

            let cardColor = cc.find('Color', card);
            cc.loader.loadRes('Textures/Widgets/Suit/'+cardInfo[0], cc.SpriteFrame, function (err, spriteFrame) {
                if(err) {
                    console.log(err);
                }
                else {
                    cardColor.active = true;
                    cardColor.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            });

            let cardNum = cc.find('Number', card);
            if(cardInfo[1] == 11) cardInfo[1] = 'J';
            if(cardInfo[1] == 12) cardInfo[1] = 'Q';
            if(cardInfo[1] == 13) cardInfo[1] = 'K';
            cardNum.getComponent(cc.Label).string = cardInfo[1];
            cardNum.active = true;

            selectableCardControl.enable =false;

            return card;
        };
        for(let card of cards) {
            addSelectableCard(card);
        }
        this.selectableCardsBox.width += i * 50 + 30;
    },

    setTagActive(seat, tagName, isActive) {
        let tag = cc.find('Tags/'+tagName, this.players[seat]);
        tag.active = isActive;
    },
    addJudge(seat, name) {
        this.setTagActive(seat, name, true);
        this.playerControls[seat].placedDelayMagicCards.add(name);
    },
    removeJudge(seat, name) {
        this.setTagActive(seat, name, false);
        this.playerControls[seat].placedDelayMagicCards.delete(name);
    },
    launchDelayMagic(seat, name) {
        this.addJudge(seat, name);
        socket.send({
            'event':'broadcast', 
            'subevent':'launchDelayMagic', 
            'data':{'to':seat, 'name':name}
        });
        this.activeEndPlayButton();
    },
    cancelDelayMagic(seat, name) {
        this.removeJudge(seat, name);
        socket.send({
            'event':'broadcast', 
            'subevent':'cancelDelayMagic', 
            'data':{'to':seat, 'name':name}
        });
    },

    judging(i) {
        if(i < this.judgeEvents.length) {
            let judgeEvent = this.judgeEvents[i];
            let func = StandardPackage.Cards.get(judgeEvent)['judging'];
            func(this, () => {
                this.cancelDelayMagic(this.seat, judgeEvent);
                if(this.self.isDead) {
                    return this.otherPlayersTurn();
                }
                this.judging(i+1);
            });
        }
        else {
            this.judgeEvents = [];
            let tags = cc.find('Tags', this.players[this.seat]).children;
            for(let tag of tags) {
                tag.active = false;
            }
            if(this.self.isDead) {
                return this.otherPlayersTurn();
            }
            this.drawPhase();
        }
    },

    playInitial() {
        this.nKills = 0;
        if(this.weaponControl.nMaxLaunch > 0) {
            this.weaponControl.enableCount = this.weaponControl.nMaxLaunch;
        }
        this.playInitialMore();
    },
    playInitialMore() {},

    playFinishClear() {
        this.nKills = -100;
        this.weaponControl.enableCount = 0;
        this.playFinishClearMore();
    },
    playFinishClearMore() {},

    // Callback functions
    whenMagicLaunch() {},
    whenHurt() {},
    beforeDiscard() {},
    whenEndPlay() {},
    afterRoundOver() {},
    afterUnloadEquipment() {},

    // ***************** Fight Phases ***************** 
    changePhase(phase) {
        this.chosenCardsDown();
        this.phase = phase;
        for(let card of this.cardsBox.children) {
            let cardControl = card.getComponent('CardControl');
            let cardHandler = StandardPackage.Cards.get(cardControl.cardName)[phase];
            cardHandler(this, cardControl);
        }
        if(phase === 'play') {
            this.onChosenCardsChange = () => {
                if(this.chosenCards.size >= 2) {
                    this.chosenCardsDown();
                }
            };
            for(let skill of this.skillBox.children) {
                let skillControl = skill.getComponent('SkillControl');
                if(this.isMyTurn) {
                    skillControl.active();
                }
            }
        }
        else {
            for(let skill of this.skillBox.children) {
                let skillControl = skill.getComponent('SkillControl');
                if(this.isMyTurn) {
                    skillControl.deactive();
                }
            }
            this.onChosenCardsChange = () => {};
        }
    },

    judgePhase() {
        socket.send({'event':'changeState', 'state':'判定阶段'});
        this.changePhase('judge');
        this.isMyTurn = true;
        this.skipPlayPhase = false;
        this.judgeEvents = Array.from(this.self.placedDelayMagicCards);
        this.judging(0);
    },

    drawPhase() {
        socket.send({'event':'changeState', 'state':'抽牌阶段'});
        this.changePhase('draw');
        socket.send({'event':'drawCards', 'count':this.nDrawCards, 'turnPlay':true});
    },

    playPhase() {
        if(this.skipPlayPhase) {
            return this.discardPhase();
        }
        socket.send({'event':'changeState', 'state':'出牌阶段'});
        this.changePhase('play');
        this.activeEndPlayButton();
        this.playInitial();
    },

    discardPhase() {
        this.beforeDiscard();
        if(this.skipDiscardPhase) {
            return this.otherPlayersTurn();
        }
        socket.send({'event':'changeState', 'state':'弃牌阶段'});
        this.changePhase('discard');
        this.playFinishClear();
        this.selfDiscard();
    },

    otherPlayersTurn() {
        socket.send({'event':'changeState', 'state':''});
        this.changePhase('wait');

        // console.log('hp:'+this.self.health+" ncards:"+this.self.nCards);
        // console.log('cards:', this.cardsBox.children);

        // next player
        let nextSeat = (this.seat + 1) % this.players.length;
        while(this.playerControls[nextSeat].isDead) {
            nextSeat = (nextSeat + 1) % this.players.length;
        }
        socket.send({'event':'nextPlayerTurn', 'seat':nextSeat});
        this.isMyTurn = false;

        this.afterRoundOver();
    },

    // ***************** Game over *****************  
    gameOver(winner) {
        let idx = winner.findIndex((value) => {return value === this.identity;});
        if(idx !== -1) {
            let WinUI = cc.find('Canvas/Win');
            WinUI.active = true;
            let action = cc.fadeIn(0.5);
            WinUI.getChildByName('Label').runAction(action);
        }
        else {
            let LoseUi = cc.find('Canvas/Lose');
            LoseUi.active = true;
            let action = cc.fadeIn(0.5);
            LoseUi.getChildByName('Label').runAction(action);
        }
        socket.clearHandlers();
        cc.find('Canvas/GoBack').active = true;
    }
});
