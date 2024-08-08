import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
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

let payments = [];  // Array para almacenar los pagos
let currentIndex = 0;  // Índice del pago que se está mostrando

// Función para mostrar un pago específico
function showPayment(index) {
    const payment = payments[index];
    const paymentsList = document.getElementById('paymentsList');

    paymentsList.innerHTML = '';  // Limpiar el contenido actual

    if (payment) {
        const paymentElement = document.createElement('div');
        paymentElement.classList.add('wrapper', 'active-popup');
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
            </div>
        `;
        paymentsList.appendChild(paymentElement);
    }
}

// Función para cargar los pagos desde Firestore
async function loadPayments(userId = null) {
    try {
        const paymentsCollection = collection(db, 'payments');
        const paymentDocs = await getDocs(paymentsCollection);

        payments = [];  // Reiniciar el array de pagos

        paymentDocs.forEach(doc => {
            const payment = doc.data();

            // Filtrar pagos por userId si se proporciona
            if (userId && payment.userId !== userId) {
                return;
            }

            payments.push(payment);
        });

        if (payments.length > 0) {
            showPayment(currentIndex);  // Mostrar el primer pago
        } else {
            document.getElementById('paymentsList').innerHTML = '<p>No hay pagos registrados.</p>';
        }
    } catch (error) {
        console.error('Error al cargar los pagos:', error);
        document.getElementById('paymentsList').innerHTML = '<p>Error al cargar los pagos.</p>';
    }
}

// Función para obtener el usuario autenticado
function getCurrentUser() {
    return auth.currentUser;
}

// Navegar al pago anterior
function showPreviousPayment() {
    if (currentIndex > 0) {
        currentIndex--;
        showPayment(currentIndex);
    }
}

// Navegar al siguiente pago
function showNextPayment() {
    if (currentIndex < payments.length - 1) {
        currentIndex++;
        showPayment(currentIndex);
    }
}

// Cargar pagos cuando la ventana se carga
window.addEventListener('load', () => {
    const user = getCurrentUser();
    if (user) {
        loadPayments(user.uid);
    } else {
        loadPayments();  // Si no hay usuario autenticado, carga todos los pagos
    }
});

// Event listener para los botones de navegación
document.getElementById('prevPaymentButton').addEventListener('click', showPreviousPayment);
document.getElementById('nextPaymentButton').addEventListener('click', showNextPayment);

// Event listener para el botón "Ver Todos los Pagos"
document.getElementById('viewAllPaymentsButton').addEventListener('click', () => {
    loadPayments();  // Cargar todos los pagos
});
