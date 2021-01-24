const fetchbtn = document.querySelector('#fetchbutton');
const copybtn = document.querySelector('#copybutton');
const playbtn = document.querySelector('#playbutton');

fetchbtn.addEventListener('click', () => {
  // disable sliders on fetch game code
  const sliders = document.querySelectorAll('.mdl-slider');
  sliders.forEach((elem) => {
    elem.setAttribute('disabled', true);
  });
  // Post slider values and creator ID to new_game
  fetchGameCode();
  // hide fetch button
  fetchbtn.style.display = 'none';
});

copybtn.addEventListener('click', () => {
  const gamecode = document.querySelector('#gamecode');
  const snackbarContainer = document.querySelector('#snackbar');
  navigator.clipboard.writeText(gamecode.innerHTML);
  var data = { message: '' };
  try {
    let copied = document.execCommand('copy');
    data.message = copied ? 'Code copied to clipboard' : 'Error copying code';
  } catch (err) {
    data.message = 'Oops, unable to copy';
  }
  snackbarContainer.MaterialSnackbar.showSnackbar(data);
});

playbtn.addEventListener('click', async () => {
  fetch('/play');
  document.location.href = 'play';
});

async function fetchGameCode() {
  const json = getSettings();
  try {
    const response = await fetch('/host', {
      method: 'post',
      body: json,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      mode: 'same-origin',
    });
    if (response.ok) {
      // Get game-code from response text
      const responseText = await response.text();
      const gamecodeDiv = document.querySelector('#codecontainer');
      const gamecodeElem = document.querySelector('#gamecode');
      // Fill div with gamecode info
      gamecodeElem.innerHTML = responseText;
      gamecodeDiv.style.display = 'inline-block';
      playbtn.style.display = 'inline-block';
    }
  } catch (err) {
    alert(err);
  }
}

function getSettings() {
  const sliderDuration = document.querySelector('#slider-dur');
  const sliderMaxPlayers = document.querySelector('#slider-mp');
  const token = document.cookie.split('=')[1];
  return JSON.stringify({
    token: token,
    duration: sliderDuration.value,
    maxPlayers: sliderMaxPlayers.value,
  });
}
