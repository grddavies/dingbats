const jwt = require('jsonwebtoken');
const uuid = require('uuid');

function route(req, res) {
  // TODO: does body need sanitizing?
  const { playername } = req.body;
  // assign a server-side uuid and associate with playername in jwt
  const tokenPayload = {
    playername: playername,
    playerid: uuid.v4(),
  };
  const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET);
  res.send(accessToken);
}

function verifyToken(req, res, next) {
  const { cookie } = req.headers;
  const token = cookie && cookie.split('=')[1];
  if (!token) return res.sendStatus(401);
  decodeToken(token)
    .then((decoded) => {
      req.player = decoded;
      next();
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(403);
    });
}

function decodeToken(token) {
  return new Promise((res, rej) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) rej(err);
      res(decoded);
    });
  });
}

module.exports = { route, verifyToken, decodeToken };
