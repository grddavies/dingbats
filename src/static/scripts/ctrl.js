const startbtn = document.querySelector("#startbutton");
const duration = document.querySelector("#duration");
const nextbtn = document.querySelector("#correctbutton");
const passbtn = document.querySelector("#passbutton");

function sendData(data, url) {
  const XHR = new XMLHttpRequest();
  // Define what happens in case of error
  XHR.addEventListener("error", function (event) {
    alert("Oops! Something went wrong.");
  });
  XHR.open("POST", url);
  XHR.setRequestHeader("Content-Type", "application/json");
  XHR.send(data);
}

startbtn.addEventListener("click", function () {
  let json = `{"duration":${duration.value}}`;
  sendData(json, "/ctrl/startgame");
});

nextbtn.addEventListener("click", function () {
  let json = `{"imagectrl":"correct"}`;
  sendData(json, "/ctrl/change_image");
});

passbtn.addEventListener("click", function () {
  let json = `{"imagectrl":"pass"}`;
  sendData(json, "/ctrl/change_image");
});
