const startbtn = document.querySelector('#startbutton');
const duration = document.querySelector('#duration');
const correctbtn = document.querySelector('#correctbutton');
const passbtn = document.querySelector('#passbutton');

function sendData(data, url) {
  const XHR = new XMLHttpRequest();
  // Define what happens in case of error
  XHR.addEventListener('error', function (event) {
    alert('Oops! Something went wrong.');
  });
  XHR.open('POST', url);
  XHR.setRequestHeader('Content-Type', 'application/json');
  XHR.send(data);
}

startbtn.addEventListener('click', function () {
  let msg = JSON.stringify({
    type: 'start',
    duration: duration.value,
  });
  if (socketClient.readyState === 1) {
    socketClient.send(msg);
  }
});

correctbtn.addEventListener('click', function () {
  let msg = JSON.stringify({
    type: 'change_image',
    imagectrl: 'correct',
  });
  if (socketClient.readyState === 1) {
    socketClient.send(msg);
  }
});

passbtn.addEventListener('click', function () {
  let msg = JSON.stringify({
    type: 'change_image',
    imagectrl: 'pass',
  });
  if (socketClient.readyState === 1) {
    socketClient.send(msg);
  }
});
