const socketClient = new WebSocket(
  `${location.protocol == 'https:' ? 'wss' : 'ws'}://${location.hostname}:${
    location.port
  }`,
);
socketClient.onopen = (event) => {
  // Send msg to server with nickname
  const token = document.cookie.split('=')[1];
  let msg = {
    type: 'join',
    token: token,
  };
  socketClient.send(JSON.stringify(msg));
  // Update status dot with friendly green
  document.querySelector('#statusdot').style.backgroundColor = 'green';
};

socketClient.onclose = () => {
  document.querySelector('#statusdot').style.backgroundColor = '#B00020';
};

var interval;
socketClient.onmessage = handleMessage;

function setTimer(endTime) {
  // Start timer
  let timeNow = new Date().getTime();
  timeEnd = new Date(endTime);
  // time left in ms
  let timeLeft = timeEnd - timeNow;
  // where to display timer
  display = document.querySelector('#time');
  if (interval) {
    clearInterval(interval);
  }
  interval = startTimer(timeLeft / 1000, display);
}

function startTimer(duration, display) {
  var timer = duration,
    minutes,
    seconds;
  var interval = setInterval(function () {
    if (--timer <= 0) {
      timer = 0;
      // display.style.color = "red";
      display.classList.add('blinking');
      clearInterval(interval);
      console.log(interval);
    }
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    display.textContent = minutes + ':' + seconds;
  }, 1000);
  return interval;
}

function changeImage(imageName) {
  document.querySelector('#image').src = 'images/puzzles/' + imageName;
}

function changeSoln(solutionText) {
  if (document.querySelector('#soln')) {
    document.querySelector('#soln').innerHTML = solutionText;
  }
}

function handleMessage(event) {
  var msg = JSON.parse(event.data);
  switch (msg.type) {
    case 'start':
      // Change image
      changeImage(msg.imagename);
      setTimer(msg.endtime);

      if (location.pathname == '/ctrl') {
        // Display solution
        changeSoln(msg.solution);
        // Hide start button and show game buttons
        document.querySelector('#startbutton').style.display = 'none';
        document.querySelector('#setduration').style.display = 'none';
        document.querySelector('#correctbutton').style.display = 'flex';
        document.querySelector('#soln').style.display = 'flex';
        document.querySelector('#passbutton').style.display = 'flex';
      }
      break;

    case 'change_image':
      changeImage(msg.imagename);
      changeSoln(msg.solution);
      document.querySelector('#score').innerHTML = msg.score;
      document.querySelector('#shown').innerHTML = msg.shown;
      setTimer(msg.endtime);
      break;
  }
}
