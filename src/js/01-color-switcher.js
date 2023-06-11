const refs = {
  body: document.querySelector('body'),
  startBtn: document.querySelector('[data-start]'),
  stopBtn: document.querySelector('[data-stop]'),
};

let isOnStart = false;
let isDisabled = false;
let intervalId = null;

disableStopStartBtns();

refs.startBtn.addEventListener('click', onStartBtn);
refs.stopBtn.addEventListener('click', onStopBtn);

function onStartBtn() {
  if (isOnStart) {
    return;
  }

  intervalId = setInterval(() => {
    refs.body.style.backgroundColor = getRandomHexColor();
  }, 1000);
  isOnStart = true;
  isDisabled = true;
  disableStopStartBtns();
}

function onStopBtn() {
  clearInterval(intervalId);

  isOnStart = false;
  isDisabled = false;

  disableStopStartBtns();
}

function disableStopStartBtns() {
  refs.startBtn.disabled = isDisabled;
  refs.stopBtn.disabled = !isDisabled;
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}
