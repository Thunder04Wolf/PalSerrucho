import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
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
const db = getFirestore(app);
const auth = getAuth(app);

// Cargar usuarios desde Firestore y llenar el select
async function loadRegisteredUsers() {
    try {
        const usersCollection = collection(db, 'users');
        const userDocs = await getDocs(usersCollection);
        const selectElement = document.getElementById('people');

        // Limpiar opciones existentes
        selectElement.innerHTML = '';

        if (userDocs.empty) {
            console.log('No hay usuarios en la colección.');
            return;
        }

        userDocs.forEach(doc => {
            const user = doc.data();
            console.log('Usuario:', user);
            const option = document.createElement('option');
            option.value = user.username; // Asegúrate de que 'username' sea el campo correcto
            option.textContent = user.username;
            selectElement.appendChild(option);
        });

        if (selectElement.options.length === 0) {
            console.log('No se agregaron opciones al campo de selección.');
        }
    } catch (error) {
        console.error('Error al cargar los usuarios:', error);
    }
}

// Calcular el monto por persona cuando cambien las opciones seleccionadas
document.getElementById('people').addEventListener('change', function() {
    const amount = parseFloat(document.getElementById('amount').value);
    const selectedOptions = Array.from(this.selectedOptions);
    const numberOfPeople = selectedOptions.length;
    const amountPerPerson = numberOfPeople > 0 ? (amount / numberOfPeople).toFixed(2) : 0;

    document.getElementById('amountPerPerson').value = amountPerPerson;
});

// Manejo del formulario
document.getElementById('paymentForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value.trim();
    const date = document.getElementById('date').value;
    const selectedOptions = Array.from(document.getElementById('people').selectedOptions);
    const numberOfPeople = selectedOptions.length;
    const selectedPeople = selectedOptions.map(option => option.value);

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

    const payment = {
        amount: amount,
        description: description,
        date: date,
        userId: user.uid,
        numberOfPeople: numberOfPeople,
        peopleNames: selectedPeople,
        amountPerPerson: parseFloat(document.getElementById('amountPerPerson').value)
    };

    try {
        await addDoc(collection(db, 'payments'), payment);
        displayMessage('Pago guardado exitosamente.', 'success');
        document.getElementById('paymentForm').reset();
    } catch (error) {
        console.error("Error adding document: ", error);
        displayMessage('Error al guardar el pago.', 'error');
    }
});

function displayMessage(message, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.style.color = type === 'error' ? 'red' : 'green';
}

// Cargar usuarios cuando la ventana se carga
window.addEventListener('load', loadRegisteredUsers);
