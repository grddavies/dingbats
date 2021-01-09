const {readGame, writeGame } = require('../gameController/gameController');
const db = require('../dataLayer/db');
const socketeer = require('../socketeer/socketeer')

module.exports = async (req, res) => {
    // let gameid = req.body.gameid;
    let gameid = 999;
    let ctrlMessage = req.body.imagectrl;
    let game = await readGame(gameid);
    // Get image change message
    switch (ctrlMessage) {
        // If correct, do something
        case 'correct':
            console.log('CORRECT');
            game.score++;
            game.shown++;
            break;
        case 'pass':
            console.log('PASS');
            game.shown++;
            // store skipped IDs in gameObj
            break;
    }
    var nextPuzzle = await db.getNextPuzzle(game.currentPuzzle);
    game.currentPuzzle = nextPuzzle.id;
    writeGame(game)
    // write message to send to WS Clients
    let msg = JSON.stringify({
        type: 'change_image',
        imagename: nextPuzzle.filename,
        solution: nextPuzzle.solution,
        shown: game.shown,
        score: game.score,
    });
    socketeer.push(msg);
    res.end();
}