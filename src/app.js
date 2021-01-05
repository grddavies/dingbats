const express = require("express");
const helmet = require("helmet");
const exphbs = require("express-handlebars");
const path = require("path");
const https = require("https");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.static(path.join(__dirname, 'static'))); // Set static assets folder

// Set up Handlebars view engine
app.set('views', 'src/views')
const port = process.env.PORT || 3000;
app.engine('hbs', exphbs({extname: 'hbs'}));
app.set("view engine", 'hbs'); // Use handlebars
app.use(express.json()); // Use JSON HTTP body parser

// Use Helmet (for setting HTTP headers)
app.use(helmet())


// Path to game data file
var gameData = path.join(__dirname, "gamedata.json");
// Global variable - gameObj
var gameObj = readGameData();
// Connect to database
const dbfile = "cave.db";
let db = new sqlite3.Database(dbfile, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Connected to database at ${dbfile}`);
});

var maxPuzzleId = 0;
(function getMaxPuzzleID() {
  let sql = `SELECT * 
             FROM puzzle 
             WHERE id = (select max(id) from puzzle);`;
  db.get(sql, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    if (row) {
      console.log(`Max puzzleID in db = ${row.id}`);
      maxPuzzleId = row.id;
    } else {
      console.log("DB EMPTY");
    }
  });
})();

app.get("/", (req, res) => { res.render("index") });

// Request to play page
app.get("/play", (req, res) => { res.render("play") });

// Request to control page -> render
app.get("/ctrl", (req, res) => { res.render("ctrl") });

// Post request to ctrl/reset
app.post("/ctrl/startgame", function startGame(req, res) {
  // If puzzleid does not exist, set to 0
  if (!gameObj.puzzleid) {
    gameObj.puzzleid = 0;
  }
  // Set game duration
  gameObj.duration = req.body.duration;
  // Set end time
  gameObj.endtime = setGameEndTime(gameObj.duration).toUTCString();
  gameObj.score = 0;
  gameObj.shown = 0;
  writeGameData();

  function startGame(puzzle) {
    // Make the startgame message
    let msg = createStartMessage(gameObj, puzzle);
    console.log(`Game started: ${new Date()}`);
    // TODO: client-side confirmation of success!
    // EG get rid of START GAME button
    // Push game end time to open websockets
    wsServer.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(msg);
      }
    });
  }

  getNextPuzzle(startGame);
  res.end();
});

// Post request to ctrl/change_image
app.post("/ctrl/change_image", (req, res) => {
  writeGameData();

  function nextImage(puzzle) {
    // Get image change message
    let ctrlMessage = req.body.imagectrl;
    switch (ctrlMessage) {
      // If correct, do something
      case "correct":
        console.log("CORRECT");
        gameObj.score++;
        gameObj.shown++;
        break;
      case "pass":
        console.log("PASS");
        gameObj.shown++;
        // store skipped IDs in gameObj
        break;
    }
    writeGameData();
    // write message to send to WS Clients
    let msg = {
      type: "change_image",
      imagename: puzzle.filename,
      solution: puzzle.solution,
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
  }
  getNextPuzzle(nextImage);
  res.end();
});

// Set server to listen
server = https.createServer(
  {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
  },
  app
);
server.listen(port, () => console.log(`App listening to port ${port}`));

// // HTTP server
// const server = app.listen(port, () => console.log(`App listening to port ${port}`));

// Configure websocket
const ws = require("ws");
const { settings } = require("cluster");
const wsServer = new ws.Server({ server });

wsServer.on("connection", (socketClient) => {
  console.log("connected"); // todo give name to client
  console.log("client Set length: ", wsServer.clients.size);

  socketClient.on("close", (socketClient) => {
    console.log("closed");
    console.log("Number of clients: ", wsServer.clients.size);
  });
});

function writeGameData() {
  //** Write gameObj to file */
  let fileData = JSON.stringify(gameObj);
  fs.writeFileSync(gameData, fileData, "utf8", (err) => {
    if (err) throw err;
    console.log(`${gameData} updated`);
  });
}

function readGameData() {
  //** Read game data into JS object */
  let filestring = fs.readFileSync(gameData, "utf8", (err, data) => {
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
    type: "start",
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

function getNextPuzzle(nextAction) {
  // Get puzzle img and solutionn from DB
  let sql = `SELECT id, filename, solution
             FROM puzzle
             WHERE id  > ?
             LIMIT 1;`;

  // reset puzzleId at last db entry
  if (gameObj.puzzleid >= maxPuzzleId) {
    gameObj.puzzleid = 0;
  }

  // Read puzzle from db as row
  db.get(sql, [gameObj.puzzleid], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    if (row) {
      console.log(row.id, row.filename, row.solution);
    } else {
      console.log(`No puzzle found with the id > ${gameObj.puzzleid}`);
    }
    // do the next thing with row
    gameObj.puzzleid = row.id;
    nextAction(row);
  });
}
