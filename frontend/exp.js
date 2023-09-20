let currentPage = 1;
let totalPages = 1;

const userForm = document.getElementById('user-form');
const userList = document.getElementById('user-list');
const logout = document.getElementById('logOut');
const previousButton = document.getElementById('previousButton');
const nextButton = document.getElementById('nextButton');

userForm.addEventListener('submit', handleUserForm);

async function handleUserForm(event) {
    event.preventDefault();

    const expense = document.getElementById('expense').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    const userData = { expense, description, category };

    const token = localStorage.getItem('token');

    if(token) {
        try {
            const response = await fetch(`/exp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
    
            if (response.ok) {
                console.log(`Expense created successfully!${token}`);
                userForm.reset();
    
                fetchUsers();
            } else {
                console.log('Error creating expense.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.log("Token not found!");
    }
};    

previousButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchUsers();
  }
});

nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchUsers();
  }
});


function fetchUsers() {
    fetch(`/exp?page=${currentPage}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        userList.innerHTML = '';
        const expenses = data.expenses; 

        for (const key in expenses) {
            if (expenses.hasOwnProperty(key)) {
                const expense = expenses[key];
                const li = document.createElement('li');
                li.textContent = `${expense.expense} - ${expense.description} - ${expense.category}`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    deleteUser(expense._id); 
                });

                li.appendChild(deleteButton);
                userList.appendChild(li);
            }
        }

        totalPages = data.totalPages;
        updatePaginationButtons();
        
    })
    .catch(error => console.error('Error:', error));
}


function updatePaginationButtons() {
  previousButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

async function deleteUser(expenseId) {
    try {
        const response = await fetch(`/exp/${expenseId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            fetchUsers();
        } else {
            console.error('Error deleting user.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchUsers();

logout.addEventListener('click', handlelogout);

async function handlelogout(event) {

    window.location.href="login.html";
    alert("Logged Out Successfully");
}


