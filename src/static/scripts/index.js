const nickname = document.querySelector('#nickname');

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