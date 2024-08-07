document.addEventListener('DOMContentLoaded', function() {
    // Mostrar gastos almacenados al cargar la página
    displayExpenses();
});

// Muestra los gastos almacenados en la tabla
function displayExpenses() {
    const expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = `
        <a href="../Index/index.html">Crear Nuevo Gasto</a>
        
        <h2>Gastos Registrados</h2>
        `; // Limpiar contenido actual

    // Obtener gastos almacenados
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    if (expenses.length === 0) {
        expensesList.innerHTML = `
        <a href="../Index/index.html">Crear Nuevo Gasto</a>
        
        <h2>Gastos Registrados</h2>
        <p>No hay gastos registrados.</p>`;
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
            ${expenses.map((expense, index) => `
                <tr>
                    <td>${expense.amount.toFixed(2)}</td>
                    <td>${expense.description}</td>
                    <td>${expense.date}</td>
                    <td>
                        <button id="editar" onclick="editExpense(${index})">Editar</button>
                        <button id="eliminar" onclick="deleteExpense(${index})">Eliminar</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
    expensesList.appendChild(table);
}

// Muestra el formulario de edición con los datos del gasto
function editExpense(index) {
    // Obtener el gasto a editar
    document.getElementById('expensesList').style.display= 'none'
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expense = expenses[index];

    // Rellenar el formulario de edición con los datos del gasto
    document.getElementById('editAmount').value = expense.amount;
    document.getElementById('editDescription').value = expense.description;
    document.getElementById('editDate').value = expense.date;
    document.getElementById('editIndex').value = index;

    // Mostrar el formulario de edición
    document.getElementById('editFormContainer').style.display = 'block';
    document.getElementById('eliminar').style.display='none'
    
}

let expenseToDeleteIndex = null;

function deleteExpense(index) {
    expenseToDeleteIndex = index;
    // Mostrar el modal
    document.getElementById('confirmDeleteModal').style.display = 'block';
}

// Maneja la confirmación de eliminación
document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    if (expenseToDeleteIndex !== null) {
        var expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        expenses.splice(expenseToDeleteIndex, 1);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        displayExpenses();
    }
    closeDeleteModal();
});

// Maneja la cancelación de eliminación
document.getElementById('cancelDeleteButton').addEventListener('click', function() {
    closeDeleteModal();
});

// Función para cerrar el modal
function closeDeleteModal() {
    document.getElementById('confirmDeleteModal').style.display = 'none';
    expenseToDeleteIndex = null;
}

// Maneja el envío del formulario de edición
document.getElementById('editExpenseForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const index = parseInt(document.getElementById('editIndex').value, 10);
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

    // Obtener los gastos almacenados
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    
    // Actualizar el gasto en la lista
    expenses[index] = {
        amount: amount,
        description: description,
        date: date
    };

    // Guardar los cambios en localStorage
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Mostrar mensaje de éxito
    displayMessage('Gasto actualizado exitosamente.', 'success', 'editMessage');
    
    // Ocultar el formulario de edición
    document.getElementById('editFormContainer').style.display = 'none';
    
    // Mostrar gastos actualizados
    displayExpenses();
    document.getElementById('expensesList').style.display= 'block'
    document.getElementById('eliminar').style.display='block'
    
});

// Maneja la acción del botón de cancelar
document.getElementById('cancelEditButton').addEventListener('click', function() {
    // Ocultar el formulario de edición
    document.getElementById('editFormContainer').style.display = 'none';
    document.getElementById('expensesList').style.display= 'block'
    document.getElementById('eliminar').style.display='block'
});
