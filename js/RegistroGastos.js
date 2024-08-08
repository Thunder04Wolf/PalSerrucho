// Importa las funciones necesarias de Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC-02zT4_vZC2U7n1qmSRulfM9le3PIM9I",
    authDomain: "palserrucho-96f94.firebaseapp.com",
    projectId: "palserrucho-96f94",
    storageBucket: "palserrucho-96f94.appspot.com",
    messagingSenderId: "882038664558",
    appId: "1:882038664558:web:d154687b462a86b9ca257f"
};

// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);

// Obtén la referencia a Firestore y Auth
const db = getFirestore(app);
const auth = getAuth(app);

document.getElementById('expenseForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value.trim();
    const date = document.getElementById('date').value;

    // Validar datos
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

    // Obtener el ID del usuario autenticado
    const user = auth.currentUser;
    if (!user) {
        displayMessage('Debes estar autenticado para guardar un gasto.', 'error');
        return;
    }

    // Crear objeto de gasto
    const expense = {
        amount: amount,
        description: description,
        date: date,
        userId: user.uid // Añadir el ID del usuario
    };

    try {
        // Guardar el gasto en Firestore
        await addDoc(collection(db, 'expenses'), expense);
        displayMessage('Gasto guardado exitosamente.', 'success');
        document.getElementById('expenseForm').reset();
    } catch (error) {
        console.error("Error adding document: ", error);
        displayMessage('Error al guardar el gasto.', 'error');
    }
});

function displayMessage(message, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.style.color = type === 'error' ? 'red' : 'green';
}
