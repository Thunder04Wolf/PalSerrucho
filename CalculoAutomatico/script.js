// os elementos del DOM
const participantNameInput = document.getElementById('participantName');
const amountInput = document.getElementById('amount');
const addExpenseButton = document.getElementById('addExpense');
const addContributionButton = document.getElementById('addContribution');
const expensesList = document.getElementById('expensesList');
const contributionsList = document.getElementById('contributionsList');
const summaryList = document.getElementById('summaryList');
const saveChangesButton = document.getElementById('saveChanges');
const cancelButton = document.getElementById('cancel');


let expenses = [];
let contributions = [];
let editingIndex = -1;  
let editingType = '';   


function addExpense() {
    const name = participantNameInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());

    if (name && !isNaN(amount) && amount > 0) {
        if (editingIndex === -1 || editingType === 'expense') {
            expenses.push({ name, amount });
        } else {
            expenses[editingIndex] = { name, amount };
            editingIndex = -1;
            editingType = '';
        }
        updateExpensesList();
        updateSummary();
        resetForm();
    } else {
        alert('Por favor, ingrese un nombre y un monto válido.');
    }
}

// añadir una contribución
function addContribution() {
    const name = participantNameInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());

    if (name && !isNaN(amount) && amount > 0) {
        if (editingIndex === -1 || editingType === 'contribution') {
            contributions.push({ name, amount });
        } else {
            contributions[editingIndex] = { name, amount };
            editingIndex = -1;
            editingType = '';
        }
        updateContributionsList();
        updateSummary();
        resetForm();
    } else {
        alert('Por favor, ingrese un nombre y un monto válido.');
    }
}

// editar un gasto
function editExpense(index) {
    const expense = expenses[index];
    participantNameInput.value = expense.name;
    amountInput.value = expense.amount;
    editingIndex = index;
    editingType = 'expense';
}

// eliminar un gasto
function deleteExpense(index) {
    expenses.splice(index, 1);
    updateExpensesList();
    updateSummary();
}

//  marcar como pagado
function markAsPaid(index, type) {
    if (type === 'expense') {
        expenses.splice(index, 1);
        updateExpensesList();
    } else if (type === 'contribution') {
        contributions.splice(index, 1);
        updateContributionsList();
    }
    updateSummary();
}

function editContribution(index) {
    const contribution = contributions[index];
    participantNameInput.value = contribution.name;
    amountInput.value = contribution.amount;
    editingIndex = index;
    editingType = 'contribution';
}

function deleteContribution(index) {
    contributions.splice(index, 1);
    updateContributionsList();
    updateSummary();
}

function updateExpensesList() {
    expensesList.innerHTML = '';
    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.textContent = `${expense.name} gastó $${expense.amount.toFixed(2)}`;
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.classList.add('btn', 'edit-btn');
        editBtn.onclick = () => editExpense(index);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.classList.add('btn', 'delete-btn');
        deleteBtn.onclick = () => deleteExpense(index);

        const paidBtn = document.createElement('button');
        paidBtn.textContent = 'Marcar como Pagado';
        paidBtn.classList.add('btn', 'paid-btn');
        paidBtn.onclick = () => markAsPaid(index, 'expense');

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        li.appendChild(paidBtn);
        expensesList.appendChild(li);
    });
}

function updateContributionsList() {
    contributionsList.innerHTML = '';
    contributions.forEach((contribution, index) => {
        const li = document.createElement('li');
        li.textContent = `${contribution.name} contribuyó con $${contribution.amount.toFixed(2)}`;
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.classList.add('btn', 'edit-btn');
        editBtn.onclick = () => editContribution(index);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.classList.add('btn', 'delete-btn');
        deleteBtn.onclick = () => deleteContribution(index);

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        contributionsList.appendChild(li);
    });
}

function updateSummary() {
    summaryList.innerHTML = '';
    let totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    let totalContributions = contributions.reduce((total, contribution) => total + contribution.amount, 0);
    
    let participants = new Set([...expenses.map(e => e.name), ...contributions.map(c => c.name)]);
    
    participants.forEach(participant => {
        let totalParticipantExpenses = expenses.filter(e => e.name === participant).reduce((total, expense) => total + expense.amount, 0);
        let totalParticipantContributions = contributions.filter(c => c.name === participant).reduce((total, contribution) => total + contribution.amount, 0);

        let balance = totalParticipantContributions - totalParticipantExpenses;
        let li = document.createElement('li');
        if (balance > 0) {
            li.textContent = `${participant} debe recibir: $${balance.toFixed(2)}`;
        } else {
            li.textContent = `${participant} debe pagar: $${Math.abs(balance).toFixed(2)}`;
        }
        summaryList.appendChild(li);
    });
}

function resetForm() {
    participantNameInput.value = '';
    amountInput.value = '';
    editingIndex = -1;
    editingType = '';
}

// Asignar eventos a los botones
addExpenseButton.onclick = addExpense;
addContributionButton.onclick = addContribution;
saveChangesButton.onclick = () => {
    if (editingType === 'expense') {
        addExpense(); // Guardar cambios de gasto
    } else if (editingType === 'contribution') {
        addContribution(); // Guardar cambios de contribución
    }
};
cancelButton.onclick = resetForm;

updateExpensesList();
updateContributionsList();
updateSummary();
