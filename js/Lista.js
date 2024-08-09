// Importa las funciones necesarias de Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC-02zT4_vZC2U7n1qmSRulfM9le3PIM9I",
    authDomain: "palserrucho-96f94.firebaseapp.com",
    projectId: "palserrucho-96f94",
    storageBucket: "palserrucho-96f94.appspot.com",
    messagingSenderId: "882038664558",
    appId: "1:882038664558:web:d154687b462a86b9ca257f"
};

// Inicializa la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Obténemos las referencias a Firestore y Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Variable para almacenar el ID del gasto seleccionado para eliminar
let selectedExpenseId = null;

// Verifica si el usuario está autenticado y muestra los gastos
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // Si el usuario está autenticado, muestra la lista de gastos
        await displayExpenses();
    } else {
        // Si el usuario no está autenticado, redirige a la página de login
        window.location.href = '../index.html';
    }
});

/**
 * Muestra los gastos almacenados en la tabla
 */
async function displayExpenses() {
    const expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = ''; // Limpiar contenido actual

    // Obtiene la colección de gastos desde Firestore
    const expensesCol = collection(db, 'expenses');
    const expenseSnapshot = await getDocs(expensesCol);

    if (expenseSnapshot.empty) {
        // Si no hay gastos, muestra un mensaje en una tabla
        const noDataTable = document.createElement('table');
        noDataTable.innerHTML = `
            <thead>
                <tr>
                    <th colspan="6">No hay gastos registrados.</th>
                </tr>
            </thead>
        `;
        expensesList.appendChild(noDataTable);
        return;
    }

    // Crea una tabla para mostrar los gastos
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Monto</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Personas</th>
                <th>Detalles</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            ${expenseSnapshot.docs.map(doc => {
                const expense = doc.data();
                const people = expense.peopleNames ? expense.peopleNames.join(', ') : 'N/A'; // Mostrar nombres de personas que deben
                return `
                    <tr>
                        <td>${expense.amount.toFixed(2)}</td>
                        <td>${expense.description}</td>
                        <td>${expense.date}</td>
                        <td>${people}</td>
                        <td><button class="details-button" data-id="${doc.id}">Ver Detalles</button></td>
                        <td>
                            <button class="edit-button" data-id="${doc.id}">Editar</button>
                            <button class="delete-button" data-id="${doc.id}">Eliminar</button>
                        </td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    `;
    expensesList.appendChild(table);

    // Añadir eventos para los botones de detalles, editar y eliminar
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', () => editExpense(button.dataset.id));
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', () => {
            selectedExpenseId = button.dataset.id;
            openDeleteModal();
        });
    });

    document.querySelectorAll('.details-button').forEach(button => {
        button.addEventListener('click', () => showDetails(button.dataset.id));
    });
}

/**
 * Muestra el formulario de edición con los datos del gasto seleccionado
 * @param {string} id - ID del gasto a editar
 */
async function editExpense(id) {
    const expenseDoc = doc(db, 'expenses', id);
    const expenseSnapshot = await getDoc(expenseDoc);

    // Oculta la lista de gastos
    document.querySelector('.contenedor-gasto').style.display = 'none';

    if (expenseSnapshot.exists()) {
        const expense = expenseSnapshot.data();

        // Rellena el formulario de edición con los datos del gasto
        document.getElementById('editAmount').value = expense.amount;
        document.getElementById('editDescription').value = expense.description;
        document.getElementById('editDate').value = expense.date;
        document.getElementById('editIndex').value = id;

        // Muestra el formulario de edición
        document.getElementById('editFormContainer').style.display = 'block';
    }
}

// Maneja el envío del formulario de edición
document.getElementById('editExpenseForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Obtiene los valores del formulario
    const id = document.getElementById('editIndex').value;
    const amount = parseFloat(document.getElementById('editAmount').value);
    const description = document.getElementById('editDescription').value.trim();
    const date = document.getElementById('editDate').value;

    // Valida los datos del formulario
    if (isNaN(amount) || amount <= 0) {
        displayMessage('El monto debe ser un número positivo.', 'error', 'editMessage');
        return;
    }
    
    if (!description) {
        displayMessage('La descripción no puede estar vacía.', 'error', 'editMessage');
        return;
    }

    if (!date) {
        displayMessage('La fecha no puede estar vacía.', 'error', 'editMessage');
        return;
    }

    // Actualiza el gasto en Firestore
    const expenseDoc = doc(db, 'expenses', id);
    try {
        await updateDoc(expenseDoc, {
            amount: amount,
            description: description,
            date: date
        });

        // Muestra un mensaje de éxito
        displayMessage('Gasto actualizado exitosamente.', 'success', 'editMessage');
        
        // Oculta el formulario de edición y muestra la lista de gastos
        document.getElementById('editFormContainer').style.display = 'none';
        document.querySelector('.contenedor-gasto').style.display = 'block';

        // Muestra la lista actualizada de gastos
        displayExpenses();
    } catch (error) {
        console.error("Error updating expense: ", error);
        displayMessage('Error al actualizar el gasto.', 'error', 'editMessage');
    }
});

// Cancelar la edición y mostrar la lista de gastos
document.getElementById('cancelEditButton').addEventListener('click', () => {
    document.getElementById('editFormContainer').style.display = 'none';
    document.querySelector('.contenedor-gasto').style.display = 'block';
});

/**
 * Abre el modal de confirmación para la eliminación de un gasto
 */
function openDeleteModal() {
    document.getElementById('confirmDeleteModal').style.display = 'block';
    // Limpiar el mensaje de eliminación cuando se abre el modal
    document.getElementById('editMessage').textContent = '';
}

// Cierra el modal de confirmación de eliminación
document.getElementById('cancelDeleteButton').addEventListener('click', () => {
    document.getElementById('confirmDeleteModal').style.display = 'none';
    // Restablecer selectedExpenseId cuando se cancela
    selectedExpenseId = null;
});

/**
 * Maneja la confirmación de eliminación de un gasto
 */
document.getElementById('confirmDeleteButton').addEventListener('click', async function() {
    if (!selectedExpenseId) return;

    const expenseDoc = doc(db, 'expenses', selectedExpenseId);

    try {
        await deleteDoc(expenseDoc);
        displayMessage('Gasto eliminado exitosamente.', 'success', 'editMessage');
        displayExpenses();
    } catch (error) {
        console.error("Error deleting expense: ", error);
        displayMessage('Error al eliminar el gasto.', 'error', 'editMessage');
    }

    // Cierra el modal y restablece selectedExpenseId
    document.getElementById('confirmDeleteModal').style.display = 'none';
    selectedExpenseId = null;
});

/**
 * Muestra los detalles de un gasto
 * @param {string} id - ID del gasto cuyos detalles se mostrarán
 */
async function showDetails(id) {
    const expenseDoc = doc(db, 'expenses', id);
    const expenseSnapshot = await getDoc(expenseDoc);

    if (expenseSnapshot.exists()) {
        const expense = expenseSnapshot.data();
        const peopleDetails = expense.peopleNames ? 
            expense.peopleNames.map(person => `<li>${person} debe $${expense.amountPerPerson.toFixed(2)}</li>`).join('') : 'N/A';

        // Rellena el formulario de detalles con los datos del gasto
        document.getElementById('detailsAmount').textContent = `$${expense.amount.toFixed(2)}`;
        document.getElementById('detailsDescription').textContent = expense.description;
        document.getElementById('detailsDate').textContent = expense.date;
        document.getElementById('detailsPeople').innerHTML = `<ul>${peopleDetails}</ul>`;

        // Muestra el formulario de detalles
        document.getElementById('detailsFormContainer').style.display = 'block';
    }
}

// Cierra el formulario de detalles
document.getElementById('closeDetailsButton').addEventListener('click', () => {
    document.getElementById('detailsFormContainer').style.display = 'none';
});

/**
 * Muestra mensajes de éxito o error
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de mensaje ('success' o 'error')
 * @param {string} containerId - ID del contenedor del mensaje
 */
function displayMessage(message, type, containerId) {
    const messageContainer = document.getElementById(containerId);
    messageContainer.textContent = message;
    messageContainer.className = type; // 'success' o 'error'
}
