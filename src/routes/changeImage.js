const gc = require('../gameController/gameController');
const socketeer = require('../socketeer/socketeer');

module.exports = async (req, res) => {
    // let gameid = req.body.gameid;
    let gameid = 999;
    let ctrlMessage = req.body.imagectrl;
    let game = await gc.readGame(gameid);
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
            // TODO: store skipped IDs
            break;
    }
    // Get next puzzle after incrementing `shown`
    var nextPuzzle = await gc.nextPuzzle(game);
    gc.writeGame(game);
    // write message to send to WS Clients
    let msg = JSON.stringify({
        type: 'change_image',
        imagename: nextPuzzle.filename,
        solution: nextPuzzle.solution,
        shown: game.shown,
        score: game.score,
        endtime: game.curRoundEnd,
    });
    socketeer.push(msg);
    res.end();
};
