const socketClient = new WebSocket(
  `${location.protocol == "https:" ? "wss" : "ws"}://${location.hostname}:${
    location.port
  }`
);

socketClient.onopen = () => {
  // Client side confirmation that websocket open?
  // change colour of status indicator dot
  document.querySelector("#statusdot").style.backgroundColor = "green";
  // // Check for game in progress
  // let data = socketClient.url
  // socketClient.send(data);
};

socketClient.onclose = () => {
  document.querySelector("#statusdot").style.backgroundColor = "#B00020";
};
