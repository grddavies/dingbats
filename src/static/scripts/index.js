const playbtn = document.querySelector("#play");
const ctrlbtn = document.querySelector("#ctrl");

playbtn.addEventListener("click", function () {
  window.location.pathname = "/play";
});

ctrlbtn.addEventListener("click", function () {
  window.location.pathname = "/ctrl";
});
