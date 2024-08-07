import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';

const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

const auth = window.firebaseAuth;

emailInput.addEventListener('input', function () {
  toggleInputFilled(this);
});

passwordInput.addEventListener('input', function () {
  toggleInputFilled(this);
});

registerLink.addEventListener('click', () => {
  wrapper.classList.add('active');
});

loginLink.addEventListener('click', () => {
  wrapper.classList.remove('active');
});

btnPopup.addEventListener('click', () => {
  wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', () => {
  wrapper.classList.remove('active-popup');
});

function toggleInputFilled(input) {
  const inputFilled = input.value.trim() !== '';
  if (inputFilled) {
    input.parentElement.classList.add('input-filled');
  } else {
    input.parentElement.classList.remove('input-filled');
  }
}

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("User logged in successfully!");
    })
    .catch((error) => {
      alert(error.message);
    });
});
