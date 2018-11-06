var Generals = require('../GameInfo/Generals');

class GameServer5P {
    constructor() {
        this.n = 5;
    }

    // Register Handlers
    registerStartGame(player) {
        player.addHandler('startGame', (data) => {
            player.room.shuffleIdentities();
            let idents = player.room.identities;
            console.log(idents);
            let players = player.room.getPlayers();
            let lordSeat = 0;
            for(let i = 0; i < this.n; ++i) {
                if(idents[i] === 'Lord') {
                    lordSeat = i;
                }
            }
            player.room.whoseTurn = lordSeat;
            for(let i = 0; i < this.n; ++i) {
                if(!players[i]) continue;
                players[i].state = 'gaming';
                players[i].identity = idents[i];
                players[i].wsSend({'event':'startGame', 'identity':idents[i], 'lordSeat':lordSeat});
                this.registerChoseGeneral(players[i]);
            }
            player.deleteHandler('startGame');
            this.registerGetGenerals(players[lordSeat]);
        });
    }

    registerGetGenerals(player) {
        player.addHandler('getGenerals', (data) => {
            player.room.shuffleGenerals();
            let generals = Generals.StandardBosses.concat(player.room.generals.slice(0,2));
            player.wsSend({'event':'getGenerals', 'generals':generals});
        });
    }

    registerChoseGeneral(player) {
        player.addHandler('choseGeneral', (data) => {
            let chosenGeneral = data.general;
            if(player.identity === 'Lord') {
                player.room.generals = player.room.generals.concat(Generals.StandardBosses);
                player.room.generals.splice(
                    player.room.generals.findIndex(
                        (value) => value === chosenGeneral
                    ), 1);
                player.room.shuffleGenerals();
                let players = player.room.getPlayers();
                for(let i = 0; i < this.n; ++i) {
                    if(players[i].identity !== 'Lord') {
                        let generals = player.room.generals.splice(0, 5);
                        players[i].wsSend({'event':'getGenerals', 'generals':generals});
                    }
                }
            }
            player.room.broadcast(player, {'event':'choseGeneral', 'seat': player.seat, 'general':chosenGeneral});
            ++player.room.nChose;
            if(player.room.nChose === player.room.maxPlayers) {
                this.startFight(player.room);
            }
        });
    }

    startFight(room) {
        let players = room.getPlayers();
        room.shuffleCards();
        for(let player of players) {
            let cards = room.getCards(4);
            player.wsSend({'event':'startFight', 'cards':cards});
            player.clearHandlers();
            this.registerChangeState(player);
            this.registerDrawCards(player);
            this.registerGetCards(player);
            this.registerNextPlayerTurn(player);
            this.registerDisard(player);
            this.registerRequestCards(player);
            this.registerRequestCardsForcibly(player);
            this.registerResponseOne(player);
            this.registerBroadcast(player);
            this.registerDamageOthers(player);
            this.registerGrabControl(player);
            this.registerRestoreControl(player);
            this.registerPlayerDead(player);
            this.registerRequestCertainAmountOfCards(player);
        }
    }

    registerChangeState(player) {
        player.addHandler('changeState', (data) => {
            player.room.broadcast(player, 
                {'event':'otherChangeState', 'seat':player.seat, 'state':data.state});
        });
    }

    registerDrawCards(player) {
        player.addHandler('drawCards', (data) => {
            let count = data.count;
            let cards = player.room.getCards(count);
            player.wsSend({'event':'drawCards', 'cards':cards, 'turnPlay': data.turnPlay});
            player.room.broadcast(player, {
                'event':'otherDrawCards', 
                'seat':player.seat, 
                'count':count,
            });
        });
    }

    registerGetCards(player) {
        player.addHandler('getCards', (data) => {
            let count = data.count;
            let cards = player.room.getCards(count);
            player.wsSend({'event':'getCards', 'cards':cards});
        });
    }

    registerDisard(player) {
        player.addHandler('discard', (data) => {
            let count = data.count;
            player.room.broadcast(player, 
                {'event':'otherDiscard', 'seat':player.seat, 'count':count, 'cards':data.cards});
        });
    }

    registerNextPlayerTurn(player) {
        player.addHandler('nextPlayerTurn', (data) => {
            player.room.whoseTurn = data.seat;
            player.room.getPlayers()[data.seat].wsSend({'event':'yourTurn'});
        });
    }

    registerRequestCards(player) {
        player.addHandler('requestCards', (data) => {
            player.room.broadcast(player, {
                'event':'requestCards', 
                'from':player.seat, 
                'to':data.to, 
                'cards':data.cards,
                'ignoreArmor': data.ignoreArmor,
            });
        });
    }

    registerRequestCertainAmountOfCards(player) {
        player.addHandler('requestCertainAmountOfCards', (data) => {
            player.room.broadcastAll({
                'event':'requestCertainAmountOfCards', 
                'from':player.seat, 
                'to':data.to, 
                'card':data.card, 
                'count': data.count
            });
        });
    }

    registerRequestCardsForcibly(player) {
        player.addHandler('requestCardsForcibly', (data) => {
            player.room.broadcast(player, {
                'event':'requestCardsForcibly', 
                'from':player.seat, 
                'to':data.to, 
                'cards':data.cards
            });
        });
    }

    registerResponseOne(player) {
        player.addHandler('responseOne', (data) => {
            player.room.getPlayers()[data.to].wsSend({
                'event':data.subevent, 
                'from': player.seat,
                'data': data.data,
            });
        });
    }

    registerBroadcast(player) {
        player.addHandler('broadcast', (data) => {
            player.room.broadcast(player, {
                'event':data.subevent, 
                'from':player.seat,
                'data':data.data,
            });
        });
    }

    registerDamageOthers(player) {
        player.addHandler('damageOthers', (data) => {
            player.room.broadcast(player, {
                'event': 'somebodyHurt',
                'from': data.from,
                'to': data.to,
                'damage': data.damage,
            });
        });
    }

    registerGrabControl(player) {
        player.addHandler('grabControl', (data) => {
            player.room.getPlayers()[player.room.whoseTurn].wsSend({
                'event':'grabControl'
            });
        });
    }
    registerRestoreControl(player) {
        player.addHandler('restoreControl', (data) => {
            player.room.getPlayers()[player.room.whoseTurn].wsSend({
                'event':'restoreControl'
            });
        });
    }

    registerPlayerDead(player) {
        player.addHandler('iamDead', (data) => {
            player.room.broadcast(player, {
                'event': 'playerDead',
                'from': player.seat,
                'identity': player.identity,
                'murderer':data.murderer,
            });
            player.isDead = true;
            let info = player.room.isGameOver();
            if(info.over) {
                player.room.broadcastAll({'event':'gameOver', 'winner':info.winner});
            }
        });
    }
}

var server = new GameServer5P();

module.exports = server;