const ws = require('ws');

let wsServer;

function start(server) {
    wsServer = new ws.Server({ server });
    wsServer.on('connection', (socketClient) => {
        console.log('connected'); // todo give name to client
        console.log('Number of clients: ', wsServer.clients.size);

        socketClient.on('close', (socketClient) => {
            console.log('closed');
            console.log('Number of clients: ', wsServer.clients.size);
        });
    });
}

function push(msg) {
    wsServer.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
            client.send(msg);
        }
    });
}

module.exports = { start, push };
