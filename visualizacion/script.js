document.addEventListener('DOMContentLoaded', function() {
    displayPendingBalances();

    document.getElementById('pendingBalancesList').addEventListener('click', function(event) {
        if (event.target.classList.contains('deleteUserButton')) {
            const userIndex = event.target.dataset.index;
            deleteUser(userIndex);
        }
    });
});

function displayPendingBalances() {
    const pendingBalancesList = document.getElementById('pendingBalancesList');
    pendingBalancesList.innerHTML = '';

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.length === 0) {
        pendingBalancesList.innerHTML = '<p>No hay saldos pendientes.</p>';
        return;
    }

    users.forEach((user, index) => {
        const userItem = document.createElement('div');
        userItem.innerHTML = `
            <p>${user.name} debe ${user.balance}</p>
            <button class="deleteUserButton" data-index="${index}">Eliminar</button>
        `;
        pendingBalancesList.appendChild(userItem);
    });
}

function deleteUser(index) {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (index < 0 || index >= users.length) {
        return;
    }

    users.splice(index, 1);

    localStorage.setItem('users', JSON.stringify(users));
    displayPendingBalances();
}
