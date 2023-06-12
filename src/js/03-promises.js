import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({
  width: '320px',
  clickToClose: true,
  fontSize: '16px',
  useIcon: false,
});

const formRef = document.querySelector('.form');

let isActive = false;

function createPromise(position, delay, lastPromise) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;

    setTimeout(() => {
      if (position === lastPromise) {
        isActive = false;
      }
      if (shouldResolve) {
        resolve({ position, delay });
      }

      reject({ position, delay });
    }, delay);
  });
}

function onSubmit(e) {
  e.preventDefault();

  if (isActive) {
    return;
  }

  const { delay, step, amount } = e.currentTarget;
  let delayCount = parseInt(delay.value);
  isActive = true;

  for (let i = 1; i <= amount.value; i += 1) {
    createPromise(i, delayCount, parseInt(amount.value))
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
      });

    delayCount += parseInt(step.value);
  }
}

formRef.addEventListener('submit', onSubmit);
