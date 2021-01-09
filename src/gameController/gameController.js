const randomWords = require('random-words');
const cache = require('../dataLayer/redis');
// const db = require('../dataLayer/db');
// const permute = require('../utils/permute');

/**
 * Some description for Game object
 */
class Game {
    constructor(timerLength) {
        // ID is Redis cache index
        // this.id = randomWords({ exactly: 2, join: '-' });
        this.id = 1;
        this.timerLength = timerLength; // Round duration
        this.startTime = new Date().toISOString(); // Date created
        this.currentPuzzle = 1; // ID of current puzzle
        this.imagefile = 'newgame.png'; // name of current puzzle file
        this.shown = 0; // Num cards shown in  game
        this.score = 0; // Num correct answers
        this.curRoundEnd = undefined; // time current round ends
    }

    setRoundEndTime(game) {
        let timeNow = new Date().getTime();
        let endTime = new Date(timeNow + this.timerLength * 60000);
        this.curRoundEnd = endTime.toISOString();
        return this;
    }

    // // // TODO: find workaround allowing async call in a getter
    // get cardOrder() {
    //     return this.shuffleCards();
    // }

    // shuffleCards() {
    //     db.getAllIds().then((allIDs) => {return permute(allIDs)});
    //     // return permute(allIDs);
    // }
}

function writeGame(game) {
    // for (key of Object.keys(obj)) {
    //     let keyURI = game.id + key;
    //     cache.set(keyURI, JSON.stringify(game.key));
    // }
    let data = JSON.stringify(game);
    return cache.set(game.id, data);
}

async function readGame(gameid) {
    let stringified = await cache.get(gameid);
    return JSON.parse(stringified)

}

function delGame(gameid) {
    cache.del(gameid)
}

module.exports = {Game, writeGame, readGame};
