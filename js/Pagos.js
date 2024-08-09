// Importa funciones de Firebase necesarias para la configuración y operaciones
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
import { getAuth, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';

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

// Inicializa un array para almacenar los pagos y un índice para la navegación
let payments = [];
let currentIndex = 0;

/**
 * Muestra los detalles del pago en el índice especificado
 * @param {number} index - El índice del pago que se desea mostrar
 */
function showPayment(index) {
    const payment = payments[index];
    const paymentsList = document.getElementById('paymentsList');

    paymentsList.innerHTML = '';  // Limpiar el contenido actual

    if (payment) {
        const paymentElement = document.createElement('div');
        paymentElement.classList.add('wrapper');
        paymentElement.innerHTML = `
            <div class="form-box RegisterPayments">
                <div class="contenedor">
                    <h1>Detalles del Pago</h1>
                    <div class="input-box">
                        <label><strong>Descripción:</strong></label>
                        <p>${payment.description}</p>
                    </div>
                    <div class="input-box">
                        <label><strong>Monto:</strong></label>
                        <p>${payment.amount}</p>
                    </div>
                    <div class="input-box">
                        <label><strong>Fecha:</strong></label>
                        <p>${payment.date}</p>
                    </div>
                    <div class="input-box">
                        <label><strong>Personas:</strong></label>
                        <p>${payment.peopleNames ? payment.peopleNames.join(', ') : 'N/A'}</p>
                    </div>
                    <div class="input-box">
                        <label><strong>Monto por Persona:</strong></label>
                        <p>${payment.amountPerPerson ? payment.amountPerPerson : 'N/A'}</p>
                    </div>
                </div>
                <div class="navigation-buttons">
                    <button id="prevPaymentButton" class="btn">&larr; Anterior</button>
                    <button id="nextPaymentButton" class="btn">Siguiente &rarr;</button>
                </div>
            </div>
        `;
        paymentsList.appendChild(paymentElement);

        // Añade listeners para los botones de navegación
        document.getElementById('prevPaymentButton').addEventListener('click', showPreviousPayment);
        document.getElementById('nextPaymentButton').addEventListener('click', showNextPayment);
    }
}

/**
 * Carga los pagos desde Firestore y los muestra
 */
async function loadPayments() {
    try {
        console.log('Cargando pagos...');

        // Obtiene la colección de pagos desde Firestore
        const paymentsCollection = collection(db, 'payments');
        const paymentDocs = await getDocs(paymentsCollection);

        payments = [];  // Reinicia el array de pagos

        // Añade cada pago a la lista
        paymentDocs.forEach(doc => {
            const payment = doc.data();
            console.log('Pago encontrado:', payment);
            payments.push(payment);
        });

        console.log('Pagos después del filtro:', payments);

        // Muestra el primer pago si hay pagos disponibles
        if (payments.length > 0) {
            showPayment(currentIndex);
        } else {
            document.getElementById('paymentsList').innerHTML = '<p>No tienes pagos pendientes.</p>';
        }
    } catch (error) {
        console.error('Error al cargar los pagos:', error);
        document.getElementById('paymentsList').innerHTML = '<p>Error al cargar los pagos.</p>';
    }
}

/**
 * Obtiene el usuario actual autenticado
 * @returns {User | null} - El usuario autenticado o null si no hay ningún usuario
 */
function getCurrentUser() {
    return auth.currentUser;
}

/**
 * Muestra el pago anterior en la lista de pagos
 */
function showPreviousPayment() {
    if (currentIndex > 0) {
        currentIndex--;
        showPayment(currentIndex);
    }
}

/**
 * Muestra el siguiente pago en la lista de pagos
 */
function showNextPayment() {
    if (currentIndex < payments.length - 1) {
        currentIndex++;
        showPayment(currentIndex);
    }
}

// Maneja el evento de clic en el botón de cierre de sesión
document.getElementById('logoutButton').addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location.href = '../index.html';
        })
        .catch((error) => {
            console.error('Error al cerrar sesión:', error);
        });
});

// Maneja el estado de autenticación del usuario
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('Usuario autenticado:', user.uid);
        loadPayments(); // Carga los pagos cuando el usuario está autenticado
    } else {
        console.log('No hay usuario autenticado.');
        document.getElementById('paymentsList').innerHTML = '<p>Debes estar autenticado para ver los pagos.</p>';
    }
});
