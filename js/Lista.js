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
    expensesList.innerHTML = `
        <a href="../HTML/Registro.html">Crear Nuevo Gasto</a>
        <h2>Gastos Registrados</h2>
    `; // Limpiar contenido actual

    // Obtener los gastos almacenados
    const expensesCol = collection(db, 'expenses');
    const expenseSnapshot = await getDocs(expensesCol);

    if (expenseSnapshot.empty) {
        expensesList.innerHTML += `<p>No hay gastos registrados.</p>`;
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
                            <button onclick="window.editExpense('${doc.id}')">Editar</button>
                            <button onclick="window.deleteExpense('${doc.id}')">Eliminar</button>
                        </td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    `;
    expensesList.appendChild(table);
}

// Mostrar el formulario de edición con los datos del gasto
window.editExpense = async function(id) {
    const expenseDoc = doc(db, 'expenses', id);
    const expenseSnapshot = await getDoc(expenseDoc);

    if (expenseSnapshot.exists()) {
        const expense = expenseSnapshot.data();

        // Rellenar el formulario de edición con los datos del gasto
        document.getElementById('editAmount').value = expense.amount;
        document.getElementById('editDescription').value = expense.description;
        document.getElementById('editDate').value = expense.date;
        document.getElementById('editIndex').value = id;

        // Mostrar el formulario de edición
        document.getElementById('editFormContainer').style.display = 'block';
        document.getElementById('expensesList').style.display = 'none';
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
    await updateDoc(expenseDoc, {
        amount: amount,
        description: description,
        date: date
    }).then(() => {
        // Mostrar mensaje de éxito
        displayMessage('Gasto actualizado exitosamente.', 'success', 'editMessage');
        
        // Ocultar el formulario de edición
        document.getElementById('editFormContainer').style.display = 'none';
        document.getElementById('expensesList').style.display = 'block';

        // Mostrar gastos actualizados
        displayExpenses();
    }).catch((error) => {
        console.error("Error updating expense: ", error);
        displayMessage('Error al actualizar el gasto.', 'error', 'editMessage');
    });
});

// Maneja la acción del botón de cancelar
document.getElementById('cancelEditButton').addEventListener('click', function() {
    // Ocultar el formulario de edición
    document.getElementById('editFormContainer').style.display = 'none';
    document.getElementById('expensesList').style.display = 'block';
});

// Eliminar gasto
window.deleteExpense = async function(id) {
    // Mostrar el modal
    document.getElementById('confirmDeleteModal').style.display = 'block';

    // Maneja la confirmación de eliminación
    document.getElementById('confirmDeleteButton').addEventListener('click', async function() {
        try {
            await deleteDoc(doc(db, 'expenses', id));
            displayExpenses();
            closeDeleteModal();
        } catch (error) {
            console.error("Error deleting expense: ", error);
        }
    });

    // Maneja la cancelación de eliminación
    document.getElementById('cancelDeleteButton').addEventListener('click', function() {
        closeDeleteModal();
    });
}

// Función para cerrar el modal
function closeDeleteModal() {
    document.getElementById('confirmDeleteModal').style.display = 'none';
}

// Función para mostrar mensajes
function displayMessage(message, type, elementId) {
    const messageElement = document.getElementById(elementId);
    messageElement.textContent = message;
    messageElement.className = type;
}
