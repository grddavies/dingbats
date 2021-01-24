const { verifyToken } = require('./auth');

const gc = require('../gameController/gameController');
const { decodeToken } = require('../routes/auth');

get = (req, res) => {
  res.render('host');
};

post = async (req, res) => {
  // Game settings
  const settings = req.body;
  const playerdata = await decodeToken(settings.token)
  const game = gc.newGame(playerdata.playerid,
                          settings.duration, 
                          settings.maxPlayers);
  gc.writeGame(game);
  res.send(String(game.id));
};

module.exports = { get, post };
