// Importa funciones necesarias de Firebase para la inicialización, Firestore y autenticación
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';

// Configuración de Firebase con las credenciales del proyecto
const firebaseConfig = {
    apiKey: "AIzaSyC-02zT4_vZC2U7n1qmSRulfM9le3PIM9I",
    authDomain: "palserrucho-96f94.firebaseapp.com",
    projectId: "palserrucho-96f94",
    storageBucket: "palserrucho-96f94.appspot.com",
    messagingSenderId: "882038664558",
    appId: "1:882038664558:web:d154687b462a86b9ca257f"
};

// Inicializa la aplicación de Firebase y obtiene las instancias de Firestore y Auth
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/**
 * Carga los usuarios registrados desde Firestore y los añade a un campo select.
 */
async function loadRegisteredUsers() {
    try {
        // Obtiene la colección de usuarios de Firestore
        const usersCollection = collection(db, 'users');
        const userDocs = await getDocs(usersCollection);
        const selectElement = document.getElementById('people');

        // Limpia las opciones existentes en el campo select
        selectElement.innerHTML = '';

        if (userDocs.empty) {
            console.log('No hay usuarios en la colección.'); // Mensaje de depuración
            return;
        }

        // Añade cada usuario a las opciones del campo select
        userDocs.forEach(doc => {
            const user = doc.data();
            console.log('Usuario:', user); // Mensaje de depuración
            const option = document.createElement('option');
            option.value = user.username; // Asegúrate de que 'username' sea el campo correcto
            option.textContent = user.username;
            selectElement.appendChild(option);
        });

        if (selectElement.options.length === 0) {
            console.log('No se agregaron opciones al campo de selección.'); // Mensaje de depuración
        }
    } catch (error) {
        console.error('Error al cargar los usuarios:', error); // Muestra un mensaje de error si ocurre un problema
    }
}

/**
 * Calcula el monto por persona cuando cambian las opciones seleccionadas en el campo select.
 */
document.getElementById('people').addEventListener('change', function() {
    const amount = parseFloat(document.getElementById('amount').value);
    const selectedOptions = Array.from(this.selectedOptions);
    const numberOfPeople = selectedOptions.length;
    const amountPerPerson = (numberOfPeople > 0 && !isNaN(amount)) ? (amount / numberOfPeople).toFixed(2) : '0.00';

    document.getElementById('amountPerPerson').value = amountPerPerson; // Actualiza el campo con el monto por persona
});

/**
 * Maneja el envío del formulario de pagos.
 * @param {Event} event - El evento de envío del formulario.
 */
document.getElementById('paymentForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita el comportamiento por defecto del formulario

    // Obtiene los valores del formulario
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value.trim();
    const date = document.getElementById('date').value;
    const selectedOptions = Array.from(document.getElementById('people').selectedOptions);
    const numberOfPeople = selectedOptions.length;
    const selectedPeople = selectedOptions.map(option => option.value);

    // Validaciones
    if (isNaN(amount) || amount <= 0) {
        displayMessage('El monto debe ser un número positivo.', 'error');
        return;
    }
    
    if (!description) {
        displayMessage('La descripción no puede estar vacía.', 'error');
        return;
    }

    if (!date) {
        displayMessage('La fecha no puede estar vacía.', 'error');
        return;
    }

    if (numberOfPeople <= 0) {
        displayMessage('Debes seleccionar al menos una persona.', 'error');
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        displayMessage('Debes estar autenticado para guardar un pago.', 'error');
        return;
    }

    // Crea un objeto de pago con los datos del formulario
    const payment = {
        amount: amount,
        description: description,
        date: date,
        userId: user.uid,
        numberOfPeople: numberOfPeople,
        peopleNames: selectedPeople,
        amountPerPerson: parseFloat(document.getElementById('amountPerPerson').value) // Usa el monto calculado por persona
    };

    try {
        // Añade el pago a la colección de pagos en Firestore
        await addDoc(collection(db, 'payments'), payment);
        displayMessage('Pago guardado exitosamente.', 'success');
        document.getElementById('paymentForm').reset(); // Resetea el formulario
    } catch (error) {
        console.error("Error adding document: ", error); // Muestra un mensaje de error si ocurre un problema
        displayMessage('Error al guardar el pago.', 'error');
    }
});

/**
 * Muestra un mensaje al usuario.
 * @param {string} message - El mensaje a mostrar.
 * @param {string} type - El tipo de mensaje ('error' o 'success').
 */
function displayMessage(message, type) {
    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.color = type === 'error' ? 'red' : 'green';
    } else {
        console.warn('Elemento de mensaje no encontrado en el DOM.'); // Mensaje de advertencia si el elemento no se encuentra
    }
}

// Manejo del botón de cierre de sesión
document.getElementById('logoutButton').addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            // Redirige a la página de login después de cerrar sesión
            window.location.href = '../index.html';
        })
        .catch((error) => {
            // Maneja cualquier error que ocurra
            console.error('Error al cerrar sesión:', error);
        });
});

// Carga los usuarios registrados cuando la ventana se carga
window.addEventListener('load', loadRegisteredUsers);
