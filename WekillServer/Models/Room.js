var Generals = require('../GameInfo/Generals');
var Cards = require('../GameInfo/Cards');

class Room {
    constructor(id, password=null, maxPlayers=5) {
        this.id = id;
        this.maxPlayers = maxPlayers;
        this.players = new Array(5).fill(null);
        this.password = password;

        this.nChose = 0;

        this.identities = ['Lord', 'Loyalty', 'Traitor', 'Rebel', 'Rebel'];
        this.generals = Generals.StandardOtherGenerals.slice(0);
        this.cards = Cards.StandardCards.slice(0);

        this.whoseTurn = 0;
    }

    full() {
        let idx = this.players.findIndex((value) => {
            return value === null;
        });
        return idx === -1;
    }

    empty() {
        let idx = this.players.findIndex((value) => {
            return value !== null;
        });
        return idx === -1;
    }

    enter(player, password=null) {
        if(this.password && this.password !== password) {
            return -1;
        }
        let idx = this.players.findIndex((value) => {
            return value === null;
        });
        if(idx === -1) return -1;
        this.players[idx] = player;
        return idx;
    }

    leave(player) {
        let idx = this.players.findIndex((value) => {
            return value && value.id === player.id;
        });
        if(idx === -1) return false;
        this.players[idx] = null;
        player.room = null;
        return true;
    }

    getPlayers() {
        return this.players.filter((value) => { 
            return value !== null;
        });
    }

    getPlayerSeats() {
        return this.getPlayers().map((value) => {
            return value.seat;
        });
    }

    broadcast(source, data) {
        for(let player of this.players) {
            if(player === null || player.id === source.id) continue;
            player.wsSend(data);
        }
    }

    broadcastAll(data) {
        for(let player of this.players) {
            player.wsSend(data);
        }
    }

    // inside-out算法
    shuffle(array) {
        let newArray = array.slice(0);
        for(let i = 1; i < array.length; ++i) {
            let k = Math.round(Math.random() * i);
            newArray[i] = newArray[k];
            newArray[k] = array[i]; 
        }
        return newArray;
    }

    shuffleIdentities() {
        this.identities = this.shuffle(this.identities);
        this.identities = this.shuffle(this.identities);
    }

    shuffleGenerals() {
        this.generals = this.shuffle(this.generals);
        this.generals = this.shuffle(this.generals);
    }

    shuffleCards() {
        this.cards = this.shuffle(this.cards);
        this.cards = this.shuffle(this.cards);
    }

    getCards(num) {
        let cards = this.cards.splice(0, num);
        if(cards.length < num) {
            this.cards = Cards.StandardCards.slice(0);
            this.shuffleCards();
            cards = cards.concat(this.getCards(num - cards.length));
        }
        return cards;
    }

    // useless
    removePlayer(idx) {
        let player = this.players.splice(idx, 1)[0];
        this.players.push(player);
        for(let i = 0; i < this.players.length; ++i) {
            this.players[i].seat = i;
        }
    }

    isGameOver() {
        let alives = new Map();
        for(let identity of this.identities) {
            alives[identity] = false;
        }
        for(let player of this.players) {
            if(!player.isDead) {
                alives.set(player.identity, true);
            }
        }
        if(alives.get('Lord')) {
            if(!alives.get('Traitor') && !alives.get('Rebel')) {
                return {'over':true, 'winner':['Lord', 'Loyalty']};
            }
        }
        if(alives.get('Traitor')) {
            if(!alives.get('Loyalty') && !alives.get('Rebel') && !alives.get('Lord')) {
                return {'over':true, 'winner':['Traitor']};
            }
            else if(!alives.get('Lord')) {
                return {'over':true, 'winner':['Rebel']};
            }
        }
        if(alives.get('Rebel')) {
            if(!alives.get('Lord')) {
                return {'over':true, 'winner':['Rebel']};
            }
        }
        return {'over':false};
    }
}

module.exports = Room;