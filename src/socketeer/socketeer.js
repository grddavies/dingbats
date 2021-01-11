const ws = require('ws');
const uuid = require('uuid');

// wsMap is not currently useful,
const wsMap = new Map();
let wss;

function start(server, messageHandler) {
  wss = new ws.Server({ server });
  wss.on('connection', (ws) => {
    // Assign an unique ID to ws connections
    const id = uuid.v4();
    wsMap.set(id, ws);
    console.log(`${id} connected\nNum clients: `, wss.clients.size);
    ws.on('message', (data) => {
      messageHandler(data, id);
    });
    ws.on('close', (ws) => {
      console.log(`${id} closed\nNum clients: `, wss.clients.size);
    });
  });
}

function broadcast(msg) {
  wss.clients.forEach((ws) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(msg);
    }
  });
}

function send(msg, id) {
  let ws = wsMap.get(id);
  ws.send(msg);
}

module.exports = { start, send, broadcast };
