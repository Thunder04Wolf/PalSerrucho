document.addEventListener('DOMContentLoaded', function() {
    // Manejar la creación de un nuevo gasto
    document.getElementById('expenseForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Obtener valores del formulario
        const amount = parseFloat(document.getElementById('amount').value);
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;
        
        // Validar datos
        if (isNaN(amount) || amount <= 0 || !description.trim() || !date) {
            alert('Por favor, rellene todos los campos correctamente.');
            return;
        }
        
        // Obtener gastos almacenados
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        
        // Añadir nuevo gasto a la lista
        expenses.push({ amount, description, date });
        
        // Guardar gastos actualizados
        localStorage.setItem('expenses', JSON.stringify(expenses));

        // Crear usuario asociado al gasto con saldo aleatorio
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userName = description; // Usando la descripción como nombre del usuario
        const userBalance = parseFloat((Math.random() * 100).toFixed(2)); // Saldo aleatorio

        users.push({ name: userName, balance: userBalance });
        localStorage.setItem('users', JSON.stringify(users));
        
        // Redirigir a la lista de gastos
        window.location.href = '../Listar/lista.html';
    });
});
