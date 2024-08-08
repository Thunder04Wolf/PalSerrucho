import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const registerUsername = document.getElementById('registerUsername');
const registerPasswordRepeat = document.getElementById('registerPasswordRepeat');
const registerForm = document.getElementById('registerForm');

const auth = window.firebaseAuth;
const db = getFirestore(window.firebaseApp);

registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = registerEmail.value;
    const password = registerPassword.value;
    const username = registerUsername.value;

    if (password !== registerPasswordRepeat.value) {
        alert("Passwords do not match");
        return;
    }

    try {
        // Crear el usuario con email y password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Guardar información adicional en Firestore
        await setDoc(doc(db, 'users', user.uid), {
            username: username,
            email: email
        });

        // Redirigir a la página de lista de gastos después de registrar
        window.location.href = '../HTML/Lista.html';
    } catch (error) {
        alert(error.message);
    }
});
