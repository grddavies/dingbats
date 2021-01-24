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
      changeSoln(msg.solution);
      // Hide start button and reveal ingame controls
      const roundctrls = document.querySelectorAll('.roundctrl');
      roundctrls.forEach((elem) => {
        elem.style.display = 'none';
      });
      const ingamectrls = document.querySelectorAll('.ingamectrl');
      ingamectrls.forEach((elem) => {
        elem.style.display = 'flex';
      });
      break;

    case 'change_image':
      changeImage(msg.imagename);
      changeSoln(msg.solution);
      document.querySelector('#score').innerHTML = msg.score;
      document.querySelector('#shown').innerHTML = msg.shown;
      setTimer(msg.endtime);
      break;

    case 'display_controls':
      // Reveal ctrl panel and solution
      const ctrls = document.querySelectorAll('.ctrl');
      ctrls.forEach((elem) => {
        elem.style.display = 'flex';
      });
      break;
  }
}

const startbtn = document.querySelector('#startbutton');
const correctbtn = document.querySelector('#correctbutton');
const passbtn = document.querySelector('#passbutton');
const undobtn = document.querySelector('#undobutton');

startbtn.addEventListener('click', () => {
  let msg = JSON.stringify({
    type: 'start',
  });
  if (socketClient.readyState === 1) {
    socketClient.send(msg);
  }
});

correctbtn.addEventListener('click', () => {
  let msg = JSON.stringify({
    type: 'change_image',
    imagectrl: 'correct',
  });
  if (socketClient.readyState === 1) {
    socketClient.send(msg);
  }
});

passbtn.addEventListener('click', () => {
  let msg = JSON.stringify({
    type: 'change_image',
    imagectrl: 'pass',
  });
  if (socketClient.readyState === 1) {
    socketClient.send(msg);
  }
});

undobtn.addEventListener('click', () => {
  let msg = JSON.stringify({
    type: 'change_image',
    imagectrl: 'undo',
  });
  if (socketClient.readyState === 1) {
    socketClient.send(msg);
  }
});
