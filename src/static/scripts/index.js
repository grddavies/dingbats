const nickname = document.querySelector('#nickname');
const joinbtn = document.querySelector('#join');

validate = () => {
  var input = nickname;
  var validityState_object = input.validity;
  let string = input.value;
  var re = new RegExp('[.,/#%^&*;<>:{}=`\\~()\'"]', 'g');
  if (validityState_object.valueMissing) {
    input.setCustomValidity('What should we call you?');
  } else if (string.match(/\s/)) {
    input.setCustomValidity("try '_' or '-' instead of spaces");
  } else if (string.match(re)) {
    let punctuation = string.match(re).join('');
    input.setCustomValidity(
      `Unless your dad is Elon Musk I doubt your name has ${punctuation} in...`,
    );
  } else {
    input.setCustomValidity('');
  }
  input.reportValidity();
};

// Client side nickname storage
if (localStorage.getItem('nickname')) {
  nickname.value = localStorage.getItem('nickname');
}
nickname.addEventListener('change', () => {
  localStorage.setItem('nickname', nickname.value);
});

window.onbeforeunload = () => {
  localStorage.setItem('nickname', nickname.value);
};

nickname.addEventListener('input', validate);
window.onload = validate();

joinbtn.addEventListener('click', fetchTokenRedirect('/play'), {once: true});

async function fetchTokenRedirect(url) {
  // Fetch a token from /auth endpoint
  let json = JSON.stringify({ player: nickname.value });
  let response = await fetch('/auth', {
    method: 'post',
    body: json,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    mode: 'same-origin',
  });
  if (response.ok) {
    let data = await response.json();
    const { accessToken } = JSON.parse(data);
    // write short-lasting cookie
    document.cookie = `token=${accessToken}; Max-Age=2`;
    // //store token in localstorage
    // localStorage.setItem('refreshToken', accessToken);
    // Navigate to URL
    location = url
  }
}
