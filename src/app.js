const express = require('express');
const helmet = require('helmet');
const exphbs = require('express-handlebars');
const path = require('path');
const https = require('https');
const fs = require('fs');
db = require('./database/db');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.static(path.join(__dirname, 'static'))); // Set static assets folder

// Set up Handlebars view engine
app.set('views', 'src/views');
const port = process.env.PORT || 3000;
app.engine('hbs', exphbs({ extname: 'hbs' }));
app.set('view engine', 'hbs'); // Use handlebars
app.use(express.json()); // Use JSON HTTP body parser
app.use(helmet()); // Use Helmet (for setting HTTP headers)

// Path to game data file
var gameData = path.join(__dirname, 'gamedata.json');
// Global variable - gameObj
var gameObj = readGameData();

maxPuzzleId = db.init().then(db.getMaxPuzzleId());

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/play', (req, res) => {
    res.render('play');
});
app.get('/ctrl', (req, res) => {
    res.render('ctrl');
});
app.post('/ctrl/startgame', async (req, res) => {
    // If puzzleid does not exist, set to 0
    if (!gameObj.puzzleid) {
        gameObj.puzzleid = 0;
        // reset puzzleId at last db entry
    } else if (gameObj.puzzleid >= maxPuzzleId) {
        gameObj.puzzleid = 0;
    }

    // Set game duration
    gameObj.duration = req.body.duration;
    // Set end time
    gameObj.endtime = setGameEndTime(gameObj.duration).toUTCString();
    gameObj.score = 0;
    gameObj.shown = 0;
    writeGameData();

    var nextPuzzle = await db.getNextPuzzle(gameObj.puzzleid);
    gameObj.puzzleid = nextPuzzle.id;
    let msg = createStartMessage(gameObj, nextPuzzle);

    console.log(`Game started: ${new Date()}`);
    // Push game end time to open websockets
    wsServer.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
            client.send(msg);
        }
    });
    res.end();
});

// Post request to ctrl/change_image
app.post('/ctrl/change_image', async (req, res) => {
    if (gameObj.puzzleid >= maxPuzzleId) {
        gameObj.puzzleid = 0;
    }
    // Get image change message
    let ctrlMessage = req.body.imagectrl;
    switch (ctrlMessage) {
        // If correct, do something
        case 'correct':
            console.log('CORRECT');
            gameObj.score++;
            gameObj.shown++;
            break;
        case 'pass':
            console.log('PASS');
            gameObj.shown++;
            // store skipped IDs in gameObj
            break;
    }
    writeGameData();
    var nextPuzzle = await db.getNextPuzzle(gameObj.puzzleid);
    gameObj.puzzleid = nextPuzzle.id;
    // write message to send to WS Clients
    let msg = {
        type: 'change_image',
        imagename: nextPuzzle.filename,
        solution: nextPuzzle.solution,
        shown: gameObj.shown,
        score: gameObj.score,
    };

    // Push next image name to open websockets
    wsServer.clients.forEach(function each(client) {
        if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify(msg));
        } else {
            console.log(client.readyState);
        }
    });
    res.end();
});

// Set server to listen
server = https.createServer(
    {
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert'),
    },
    app,
);
server.listen(port, () => console.log(`App listening to port ${port}`));

// // HTTP server
// const server = app.listen(port, () => console.log(`App listening to port ${port}`));

// Configure websocket
const ws = require('ws');
const { settings } = require('cluster');
const wsServer = new ws.Server({ server });

wsServer.on('connection', (socketClient) => {
    console.log('connected'); // todo give name to client
    console.log('client Set length: ', wsServer.clients.size);

    socketClient.on('close', (socketClient) => {
        console.log('closed');
        console.log('Number of clients: ', wsServer.clients.size);
    });
});

function writeGameData() {
    //** Write gameObj to file */
    let fileData = JSON.stringify(gameObj);
    fs.writeFileSync(gameData, fileData, 'utf8', (err) => {
        if (err) throw err;
        console.log(`${gameData} updated`);
    });
}

function readGameData() {
    //** Read game data into JS object */
    let filestring = fs.readFileSync(gameData, 'utf8', (err, data) => {
        if (err) throw err;
        return data;
    });
    let gameObj = JSON.parse(filestring);
    return gameObj;
}

function createStartMessage(gameObj, startPuzzle) {
    //** Create string to send to WS clients to start game */
    // Access puzzle row from database
    let msg = {
        type: 'start',
        endtime: gameObj.endtime,
        imagename: startPuzzle.filename,
        solution: startPuzzle.solution,
    };
    return JSON.stringify(msg);
}

function setGameEndTime(minutes) {
    timeNow = new Date();
    let endTime = new Date(timeNow.getTime() + minutes * 60000);
    return endTime;
}
