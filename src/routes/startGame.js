const {Game, writeGame} = require('../gameController/gameController');
const db = require('../dataLayer/db');
const socketeer = require('../socketeer/socketeer')

module.exports = async (req, res) => {
    // REALLY WE SHOULD INITIALISE A `new Game` CLASS HERE
    // Generate random two_word code
    // check existense of code in hash (async, throw err on catch)
    let timerLength = req.body.duration
    let game = new Game(timerLength = timerLength);
    game.setRoundEndTime();
    let nextPuzzle = await db.getPuzzle(game.currentPuzzle);
    writeGame(game);
    
    game.currentPuzzle = nextPuzzle.id;
    
    let msg = createStartMessage(game, nextPuzzle);
    
    // Push game end time to open websockets
    socketeer.push(msg);
    console.log(`Game started: ${new Date()}`);
    res.end();
}

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