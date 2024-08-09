// Importa funciones de Firebase necesarias para la autenticación y Firestore
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

// Obtiene referencias a los elementos del formulario de registro
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const registerUsername = document.getElementById('registerUsername');
const registerPasswordRepeat = document.getElementById('registerPasswordRepeat');
const registerForm = document.getElementById('registerForm');

// Obtiene las instancias de autenticación y Firestore
const auth = window.firebaseAuth;  // Referencia a la instancia de autenticación
const db = getFirestore(window.firebaseApp);  // Referencia a la instancia de Firestore

/**
 * Maneja el envío del formulario de registro
 * @param {Event} e - El evento de envío del formulario
 */
registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();  // Evita el comportamiento por defecto del formulario

    const email = registerEmail.value;  // Obtiene el email del formulario
    const password = registerPassword.value;  // Obtiene la contraseña del formulario
    const username = registerUsername.value;  // Obtiene el nombre de usuario del formulario

    // Verifica que las contraseñas coincidan
    if (password !== registerPasswordRepeat.value) {
        alert("Passwords do not match");  // Muestra un mensaje de error si las contraseñas no coinciden
        return;
    }

    try {
        // Crea un nuevo usuario con el email y la contraseña proporcionados
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;  // Obtiene el usuario recién creado

        // Guarda información adicional del usuario en Firestore
        await setDoc(doc(db, 'users', user.uid), {
            username: username,
            email: email
        });

        // Redirige al usuario a la página de lista de gastos después del registro exitoso
        window.location.href = '../HTML/Lista.html';
    } catch (error) {
        alert(error.message);  // Muestra un mensaje de error si ocurre un problema durante el registro
    }
});
