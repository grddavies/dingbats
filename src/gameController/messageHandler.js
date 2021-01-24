const gc = require('./gameController');
const socketeer = require('../socketeer/socketeer');
const { decodeToken } = require('../routes/auth');

module.exports = async (data, wsid) => {
  let msg = JSON.parse(data);
  switch (msg.type) {
    case 'join':
      // WS clients send a "join" msg on connection
      joinGame(msg, wsid);
      break;
    case 'start':
      // Sent on pressing start-button
      startGame(msg);
      break;
    case 'change_image':
      // Pass or correct
      changeImage(msg);
      break;
  }
};

async function startGame(msg) {
  let game = await gc.readGame(999);
  // Shuffle all the cards
  await gc.shuffleCards(game);
  // Get first
  let firstPuzzle = await gc.nextPuzzle(game);
  game.imagefile = firstPuzzle.filename;
  game.solution = firstPuzzle.solution;
  gc.setTimer(game);
  gc.writeGame(game);
  let res = JSON.stringify({
    type: 'start',
    endtime: game.curRoundEnd,
    imagename: game.imagefile,
    solution: game.solution,
  });
  // Push game end time to all open websockets
  socketeer.broadcast(res);
  console.log(`Game started: ${new Date()}`);
}

async function changeImage(msg) {
  // Read game data
  const game = await gc.readGame(999);
  switch (msg.imagectrl) {
    // update score/shown
    case 'correct':
      game.shown++;
      game.score++;
      game.cardScore[game.shown] = 1;
      break;
    case 'pass':
      game.shown++;
      game.cardScore[game.shown] = 0;
      break;
    case 'undo':
      if (game.shown) {
        game.score = game.score - game.cardScore[game.shown];
        game.shown--;
        break;
      }
  }
  // Get next puzzle
  const nextPuzzle = await gc.nextPuzzle(game);
  // Update current image and solution
  game.imagefile = nextPuzzle.filename;
  game.solution = nextPuzzle.solution;
  gc.writeGame(game);
  // Write message
  const res = JSON.stringify({
    type: 'change_image',
    imagename: game.imagefile,
    solution: game.solution,
    shown: game.shown,
    score: game.score,
    endtime: game.curRoundEnd,
  });
  // Send to all WS Clients
  socketeer.broadcast(res);
}

async function joinGame(msg, wsid) {
  const token = msg.token;
  const player = await decodeToken(token);
  // TODO: fetch game with that code
  const game = await gc.readGame(999);
  if (!game) {
    // Game exists check should be done before opening WS
    // Game not found error -> render something client-side
  } else {
    // pair player ID and websocket ID
    game.players[player.playerid] = wsid;
    const res = JSON.stringify({
      type: 'change_image',
      imagename: game.imagefile,
      solution: game.solution,
      shown: game.shown,
      score: game.score,
      endtime: game.curRoundEnd,
    });
    socketeer.send(res, wsid);
    // Look up host's wsid
    if (wsid == game.players[game.host]) {
      socketeer.send(JSON.stringify({
        type: 'display_controls'
      }), wsid);
    }
    gc.writeGame(game);
  }
}
