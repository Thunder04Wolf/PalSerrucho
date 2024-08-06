document.getElementById('expenseForm').addEventListener('submit', function(event) {
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

    // Crear objeto de gasto
    const expense = {
        amount: amount,
        description: description,
        date: date
    };

    // Obtener gastos almacenados
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    
    // Añadir nuevo gasto
    expenses.push(expense);

    // Guardar en localStorage
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Mostrar mensaje de éxito
    displayMessage('Gasto guardado exitosamente.', 'success');
    
    // Limpiar formulario
    document.getElementById('expenseForm').reset();
});

function displayMessage(message, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.style.color = type === 'error' ? 'red' : 'green';
}
