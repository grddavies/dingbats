const nickname = document.querySelector('#nickname');
const re = new RegExp('[.,\/#%\^&\*;\<\>:{}=\`\\~()\'\"]', 'g');
nickname.setCustomValidity('What should we call you?');

validate = () => {
    var input = nickname;
    var validityState_object = input.validity;
    let string = input.value; // is this always a string?
    if (validityState_object.valueMissing) {
        input.setCustomValidity('What should we call you?');
        input.reportValidity();
    } else if (string.match(/\s/)) {
        input.setCustomValidity("try '_' or '-' instead of spaces");
        input.reportValidity();
    } else if (string.match(re)) {
        let punctuation = string.match(re).join('');
        input.setCustomValidity(
            `Unless your dad is Elon Musk I doubt your name has ${punctuation} in...`,
        );
        input.reportValidity();
    } else {
        input.setCustomValidity('');
        input.reportValidity();
    }
};

nickname.addEventListener('input', validate);
