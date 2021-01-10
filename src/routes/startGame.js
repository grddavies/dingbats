const gc = require('../gameController/gameController');
const db = require('../dataLayer/db');
const socketeer = require('../socketeer/socketeer');

module.exports = async (req, res) => {
    let timerLength = req.body.duration;
    let game = gc.newGame(timerLength);
    // Shuffle all the cards
    await gc.shuffleCards(game);
    // Get first
    let firstPuzzle = await gc.nextPuzzle(game);
    gc.setTimer(game);
    gc.writeGame(game);

    let msg = createStartMessage(game, firstPuzzle);

    // Push game end time to open websockets
    socketeer.push(msg);
    console.log(`Game started: ${new Date()}`);
    res.end();
};

function createStartMessage(gameObj, startPuzzle) {
    //** Create string to send to WS clients to start game */
    let msg = {
        type: 'start',
        endtime: gameObj.curRoundEnd,
        imagename: startPuzzle.filename,
        solution: startPuzzle.solution,
    };
    return JSON.stringify(msg);
}
