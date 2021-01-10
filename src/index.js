const express = require('express');
const exphbs = require('express-handlebars');
const helmet = require('helmet');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
const db = require('./dataLayer/db');
const cache = require('./dataLayer/redis');
const { startGame, changeImage } = require('./routes');
const socketeer = require('./socketeer/socketeer');

const app = express();
const port = process.env.PORT || 443;
const httpPort = process.env.HTTPPORT || 80;
app.use(express.static(path.join(__dirname, 'static'))); // Set static assets folder
app.use(express.json()); // Use JSON HTTP body parser
// redirect http to https
app.use(function(req, res, next) {
    if(!req.secure) {
      return res.redirect(`https://${req.get('Host')}${req.baseUrl}`);
    } 
    next();
  });
app.set('views', 'src/views'); // Set view folder
app.engine('hbs', exphbs({ extname: 'hbs' })); // Set up Handlebars view engine
app.set('view engine', 'hbs');
app.use(helmet()); // Use Helmet (for setting HTTP headers)

/**
 *  Should sqlite and redis clients be started
 * asynchronously and server listen after something like:
 * `Promise.all([db.start(), redis.connect()])` ?
 * */
db.start();
cache.start();

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/play', (req, res) => {
    res.render('play');
});
app.get('/ctrl', (req, res) => {
    res.render('ctrl');
});
app.post('/ctrl/startgame', startGame);
app.post('/ctrl/changeimage', changeImage);

// Set server to listen
server = https.createServer(
    {
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert'),
    },
    app,
);

server.listen(port, () => console.log(`App listening to port ${port}`));
socketeer.start(server);

// HTTP server
const httpServer = app.listen(httpPort, () => console.log(`HTTP listening to port ${httpPort}`));

const gracefulShutdown = () => {
    Promise.all([db.teardown(), cache.teardown()])
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
