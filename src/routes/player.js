const gc = require('../gameController/gameController');

module.exports = async (req, res) => {
  const player = req.player;
  // Add player to game object
  var game = await gc.readGame(999);
  if (game) {
    console.log(player);
    // Check if playerid in players
    if (!game.players[player.playerid]) {
      console.log('if statement did!');
      // add playerid as attr of game.players obj
      game.players[player.playerid] = null;
      await gc.writeGame(game);
    }
    res.render('play');
  } else {
    res.status(503).send("<h1>Oops, that game wasn't found!</h1>");
  }
};
