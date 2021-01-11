const gc = require('./gameController');
const socketeer = require('../socketeer/socketeer');

module.exports = async (data, id) => {
  let msg = JSON.parse(data);
  switch (msg.type) {
    // we will get a "join" msg on connection
    case 'join':
      console.log(`${msg.name} joined!`);
      // send em a join message!
      // will get a TypeError if we try to read game from empty cache
      try {
        let game = await gc.readGame(999);
        let res = JSON.stringify({
          type: 'change_image',
          imagename: game.imagefile,
          solution: game.solution,
          shown: game.shown,
          score: game.score,
          endtime: game.curRoundEnd,
        });
        socketeer.send(res, id);
      } catch (err) {
        console.error(err);
      }
      break;
    case 'start':
      startGame(msg);
      break;
    case 'change_image':
      let game = await gc.readGame(999);
      game.shown++;
      if (msg.imagectrl == 'correct') {
        game.score++;
      }
      // Get next puzzle after incrementing `shown`
      var nextPuzzle = await gc.nextPuzzle(game);
      game.imagefile = nextPuzzle.filename;
      game.solution = nextPuzzle.solution;
      gc.writeGame(game);
      // write message to send to WS Clients
      let res = JSON.stringify({
        type: 'change_image',
        imagename: game.imagefile,
        solution: game.solution,
        shown: game.shown,
        score: game.score,
        endtime: game.curRoundEnd,
      });
      socketeer.broadcast(res);
      break;
  }
};

async function startGame(msg) {
  let timerLength = msg.duration;
  let game = gc.newGame(timerLength);
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
