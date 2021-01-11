var nickname;
// Client side nickname storage
if (localStorage.getItem('nickname')) {
  nickname = localStorage.getItem('nickname');
  document.querySelector('#nickname').innerHTML = `Player: ${nickname}`;
}
