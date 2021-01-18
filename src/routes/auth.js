const jwt = require('jsonwebtoken');

function route(req, res) {
  // TODO: does body need sanitizing?
  const tokenPayload = req.body;
  const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET);
  res.send(accessToken);
};

function verifyToken(req, res, next) {
    const { cookie } = req.headers;
    const token = cookie && cookie.split('=')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.player = user;
      next();
    });
  }
  
module.exports = {route, verifyToken}