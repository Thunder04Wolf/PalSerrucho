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
const db = getFirestore(app);
const auth = getAuth(app);

let payments = [];
let currentIndex = 0;

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

        document.getElementById('prevPaymentButton').addEventListener('click', showPreviousPayment);
        document.getElementById('nextPaymentButton').addEventListener('click', showNextPayment);
    }
}

async function loadPayments() {
    try {
        console.log('Cargando pagos...');

        const paymentsCollection = collection(db, 'payments');
        const paymentDocs = await getDocs(paymentsCollection);

        payments = [];

        paymentDocs.forEach(doc => {
            const payment = doc.data();
            console.log('Pago encontrado:', payment);

            // Añadir el pago a la lista sin aplicar el filtro
            payments.push(payment);
        });

        console.log('Pagos después del filtro:', payments);

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


function getCurrentUser() {
    return auth.currentUser;
}

function showPreviousPayment() {
    if (currentIndex > 0) {
        currentIndex--;
        showPayment(currentIndex);
    }
}

function showNextPayment() {
    if (currentIndex < payments.length - 1) {
        currentIndex++;
        showPayment(currentIndex);
    }
}

document.getElementById('logoutButton').addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            window.location.href = '../index.html';
        })
        .catch((error) => {
            console.error('Error al cerrar sesión:', error);
        });
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('Usuario autenticado:', user.uid);
        loadPayments(); // Llama a loadPayments sin parámetros
    } else {
        console.log('No hay usuario autenticado.');
        document.getElementById('paymentsList').innerHTML = '<p>Debes estar autenticado para ver los pagos.</p>';
    }
});
