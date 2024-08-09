// Importa la función necesaria para la autenticación con correo y contraseña
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';

// Obtén las referencias a los elementos del DOM
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

// Obtén la referencia a la autenticación de Firebase
const auth = window.firebaseAuth;

// Añade un listener para detectar cambios en el campo de email
emailInput.addEventListener('input', function () {
  toggleInputFilled(this);
});

// Añade un listener para detectar cambios en el campo de contraseña
passwordInput.addEventListener('input', function () {
  toggleInputFilled(this);
});

// Añade un listener al enlace de registro para mostrar el formulario de registro
registerLink.addEventListener('click', () => {
  wrapper.classList.add('active');
});

// Añade un listener al enlace de inicio de sesión para mostrar el formulario de inicio de sesión
loginLink.addEventListener('click', () => {
  wrapper.classList.remove('active');
});

// Añade un listener al botón de abrir el popup de inicio de sesión
btnPopup.addEventListener('click', () => {
  wrapper.classList.add('active-popup');
});

// Añade un listener al ícono de cerrar para cerrar el popup de inicio de sesión
iconClose.addEventListener('click', () => {
  wrapper.classList.remove('active-popup');
});

/**
 * Cambia la clase del contenedor del input dependiendo de si el campo está vacío o no
 * @param {HTMLElement} input - El campo de entrada (input) cuyo estado se va a verificar
 */
function toggleInputFilled(input) {
  const inputFilled = input.value.trim() !== '';
  if (inputFilled) {
    input.parentElement.classList.add('input-filled');
  } else {
    input.parentElement.classList.remove('input-filled');
  }
}

/**
 * Maneja el envío del formulario de inicio de sesión
 * @param {Event} e - El evento del formulario
 */
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Previene el envío del formulario y recarga de la página

  // Obtiene los valores del formulario
  const email = emailInput.value;
  const password = passwordInput.value;

  // Intenta iniciar sesión con el correo y la contraseña proporcionados
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Redirige a la página de lista de gastos después de iniciar sesión
      window.location.href = '../HTML/Lista.html';
    })
    .catch((error) => {
      // Muestra un mensaje de error si el inicio de sesión falla
      alert(error.message);
    });
});
