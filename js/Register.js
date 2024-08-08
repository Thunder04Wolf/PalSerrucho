import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
import { ref, set } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js';

const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const registerUsername = document.getElementById('registerUsername');
const registerPasswordRepeat = document.getElementById('registerPasswordRepeat');
const registerForm = document.getElementById('registerForm');
const wrapper = document.querySelector('.wrapper');
const btnRegister = document.querySelector('.btn-register');

const auth = window.firebaseAuth;
const database = window.firebaseDatabase;

registerForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const email = registerEmail.value;
  const password = registerPassword.value;
  const username = registerUsername.value;

  if (password !== registerPasswordRepeat.value) {
    alert("Passwords do not match");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return set(ref(database, 'users/' + user.uid), {
        username: username,
        email: email
      });
    })
    .then(() => {
      // Redirigir a la página de lista de gastos después de registrar
      window.location.href = '../HTML/Lista.html';
    })
    .catch((error) => {
      alert(error.message);
    });
});
