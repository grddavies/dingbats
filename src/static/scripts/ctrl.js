const startbtn = document.querySelector('#startbutton');
const duration = document.querySelector('#duration');
const correctbtn = document.querySelector('#correctbutton');
const passbtn = document.querySelector('#passbutton');

startbtn.addEventListener('click', () => {
  let msg = JSON.stringify({
    type: 'start',
    duration: duration.value,
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
