import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
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

let selectedExpenseId = null;

// Verifica si el usuario está autenticado
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // Usuario autenticado, mostrar gastos
        await displayExpenses();
    } else {
        // Usuario no autenticado, redirigir al login
        window.location.href = '/path-to-login.html';
    }
});

// Mostrar gastos almacenados en la tabla
async function displayExpenses() {
    const expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = ''; // Limpiar contenido actual

    // Obtener los gastos almacenados
    const expensesCol = collection(db, 'expenses');
    const expenseSnapshot = await getDocs(expensesCol);

    if (expenseSnapshot.empty) {
        // Crear una tabla para mostrar el mensaje
        const noDataTable = document.createElement('table');
        noDataTable.innerHTML = `
            <thead>
                <tr>
                    <th colspan="4">No hay gastos registrados.</th>
                </tr>
            </thead>
        `;
        expensesList.appendChild(noDataTable);
        return;
    }

    // Crear una tabla para mostrar los gastos
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Monto</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            ${expenseSnapshot.docs.map(doc => {
                const expense = doc.data();
                return `
                    <tr>
                        <td>${expense.amount.toFixed(2)}</td>
                        <td>${expense.description}</td>
                        <td>${expense.date}</td>
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

    // Añadir event listeners para los botones de editar y eliminar
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', () => editExpense(button.dataset.id));
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', () => {
            selectedExpenseId = button.dataset.id;
            openDeleteModal();
        });
    });
}


// Mostrar el formulario de edición con los datos del gasto
async function editExpense(id) {
    const expenseDoc = doc(db, 'expenses', id);
    const expenseSnapshot = await getDoc(expenseDoc);

    // Ocultar la lista de gastos
    document.querySelector('.contenedor-gasto').style.display = 'none';

    if (expenseSnapshot.exists()) {
        const expense = expenseSnapshot.data();

        // Rellenar el formulario de edición con los datos del gasto
        document.getElementById('editAmount').value = expense.amount;
        document.getElementById('editDescription').value = expense.description;
        document.getElementById('editDate').value = expense.date;
        document.getElementById('editIndex').value = id;

        // Mostrar el formulario de edición
        document.getElementById('editFormContainer').style.display = 'block';
    }
}

// Maneja el envío del formulario de edición
document.getElementById('editExpenseForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const id = document.getElementById('editIndex').value;
    const amount = parseFloat(document.getElementById('editAmount').value);
    const description = document.getElementById('editDescription').value.trim();
    const date = document.getElementById('editDate').value;

    // Validar datos
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

    // Actualizar el gasto en Firestore
    const expenseDoc = doc(db, 'expenses', id);
    try {
        await updateDoc(expenseDoc, {
            amount: amount,
            description: description,
            date: date
        });

        // Mostrar mensaje de éxito
        displayMessage('Gasto actualizado exitosamente.', 'success', 'editMessage');
        
        // Ocultar el formulario de edición
        document.getElementById('editFormContainer').style.display = 'none';
        document.querySelector('.contenedor-gasto').style.display = 'block';

        // Mostrar gastos actualizados
        displayExpenses();
    } catch (error) {
        console.error("Error updating expense: ", error);
        displayMessage('Error al actualizar el gasto.', 'error', 'editMessage');
    }
});

// Cancelar la edición
document.getElementById('cancelEditButton').addEventListener('click', () => {
    document.getElementById('editFormContainer').style.display = 'none';
    document.querySelector('.contenedor-gasto').style.display = 'block';
});

// Abre el modal de confirmación de eliminación
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

// Maneja la confirmación de eliminación
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

    // Cierra el modal y reinicia selectedExpenseId
    document.getElementById('confirmDeleteModal').style.display = 'none';
    selectedExpenseId = null;
});

// Función auxiliar para mostrar mensajes
function displayMessage(message, type, targetId) {
    const messageElement = document.getElementById(targetId);
    messageElement.textContent = message;
    messageElement.className = type === 'error' ? 'error-message' : 'success-message';
}
