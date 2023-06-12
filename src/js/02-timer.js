import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({
  width: '320px',
});

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  resetBtn: document.querySelector('[data-reset]'),
  daysClock: document.querySelector('[data-days]'),
  hoursClock: document.querySelector('[data-hours]'),
  minutesClock: document.querySelector('[data-minutes]'),
  secondsClock: document.querySelector('[data-seconds]'),
};

let pickedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    pickedDate = selectedDates[0];
    datePickHandler(selectedDates[0]);
  },
};

flatpickr(refs.input, options);

function datePickHandler(date) {
  const today = new Date();
  if (date.getTime() + 60000 < today.getTime()) {
    Notify.failure('Please choose a date in the future', {
      clickToClose: true,
      fontSize: '16px',
    });
    return;
  }

  disableBtn(refs.startBtn, false);
}

function disableBtn(btn, isDisable) {
  btn.disabled = isDisable;
}

function clockPrettier({ days, hours, minutes, seconds }) {
  const { daysClock, hoursClock, minutesClock, secondsClock } = refs;

  daysClock.textContent = days;
  hoursClock.textContent = hours;
  minutesClock.textContent = minutes;
  secondsClock.textContent = seconds;
}

class Timer {
  constructor({ pickedDate, clockPrettier, disableBtn }) {
    this.pickedDate = pickedDate;
    this.clockPrettier = clockPrettier;
    this.disableBtn = disableBtn;
    this.intervalID = null;
    this.isActive = false;
  }

  start() {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    this.disableBtn(refs.resetBtn, false);

    const currentDate = new Date().getTime();
    let timeInterval = pickedDate - currentDate;

    this.intervalID = setInterval(() => {
      if (timeInterval <= 1000) {
        clearInterval(this.intervalID);
        this.isActive = false;
        this.disableBtn(refs.resetBtn, true);
        Notify.info('Time is out!', {
          position: 'center-center',
          timeout: 5000,
          clickToClose: true,
          fontSize: '30px',
        });
      } else {
        timeInterval -= 1000;
        this.clockPrettier(this.convertMs(timeInterval));
      }
    }, 1000);

    this.disableBtn(refs.startBtn, true);
  }

  reset() {
    clearInterval(this.intervalID);
    this.isActive = false;
    this.disableBtn(refs.resetBtn, true);
    this.clockPrettier(this.convertMs(0));
  }

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }

  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = this.addLeadingZero(Math.floor(ms / day));
    // Remaining hours
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    // Remaining minutes
    const minutes = this.addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    // Remaining seconds
    const seconds = this.addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  }
}

const timer = new Timer({
  pickedDate,
  clockPrettier,
  disableBtn,
});

refs.startBtn.disabled = true;
refs.resetBtn.disabled = true;
refs.startBtn.addEventListener('click', timer.start.bind(timer));
refs.resetBtn.addEventListener('click', timer.reset.bind(timer));
