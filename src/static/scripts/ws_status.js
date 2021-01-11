const socketClient = new WebSocket(
    `${location.protocol == 'https:' ? 'wss' : 'ws'}://${location.hostname}:${
        location.port
    }`,
);

socketClient.onopen = (event) => {
    // Send msg to server with nickname
    let msg = { name: window.localStorage.getItem('nickname') };
    socketClient.send(JSON.stringify(msg));
    // Update status dot with friendly green
    document.querySelector('#statusdot').style.backgroundColor = 'green';
};

socketClient.onclose = () => {
    document.querySelector('#statusdot').style.backgroundColor = '#B00020';
};
