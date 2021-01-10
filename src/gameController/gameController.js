// const randomWords = require('random-words');
const cache = require('../dataLayer/redis');
const db = require('../dataLayer/db');
const permute = require('../utils/permute');

function newGame(timerLength) {
    return {
        id: 999,
        timerLength: timerLength,
        imagefile: 'newgame.png',
        shown: 0,
        score: 0,
    };
}

function setTimer(game) {
    let timeNow = new Date().getTime();
    let endTime = new Date(timeNow + game.timerLength * 60000);
    game.curRoundEnd = endTime.toISOString();
    return game;
}

async function shuffleCards(game) {
    let allIDs = await db.getAllIds();
    game.cardOrder = permute(allIDs);
    return game;
}

async function nextPuzzle(game) {
    let numCards = game.cardOrder.length;
    let pid = game.cardOrder[game.shown % numCards];
    let nextPuzzle = await db.getPuzzle(pid);
    return nextPuzzle;
}

function writeGame(game) {
    let data = JSON.stringify(game);
    return cache.set(game.id, data);
}

async function readGame(gameid) {
    let stringified = await cache.get(gameid);
    return JSON.parse(stringified);
}

function deleteGame(gameid) {
    cache.del(gameid);
}

module.exports = {
    newGame,
    setTimer,
    shuffleCards,
    nextPuzzle,
    writeGame,
    readGame,
    deleteGame,
    shuffleCards,
};
