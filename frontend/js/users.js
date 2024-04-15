document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the token and redirect if not found
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Fetch and display users
    fetchUsers(token);

    // Event listener for the form submission
    document.getElementById('updateUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateUser(token);
    });
});

function fetchUsers(token) {
    fetch('http://localhost:8000/api/users', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(displayUsers)
    .catch(error => console.error('Error:', error));
}

function displayUsers(users) {
    const usersList = document.getElementById('usersList');
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = generateUserRowHTML(user);
        usersList.appendChild(row);
    });

    attachEventListeners();
}

// function generateUserRowHTML(user) {
//     return `
//         <td class="px-4 py-3">${user.id}</td>
//         <td class="px-4 py-3">${user.name}</td>
//         <td class="px-4 py-3">${user.email}</td>
//         <td class="px-4 py-3">${user.roles.map(role => role.name).join(", ")}</td>
//         <td class="px-4 py-3 flex items-center justify-between">
//             <button class="editUserBtn flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" data-user-id="${user.id}" aria-label="Edit">
//                 <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
//                 </svg>
//             </button>
//             <button class="deleteUserBtn flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" data-user-id="${user.id}" aria-label="Delete">
//                 <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
//                     <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
//                 </svg>
//             </button>
//         </td>
//     `;
// }


function generateUserRowHTML(user) {
    return `
        <td class="px-4 py-3">${user.id}</td>
        <td class="px-4 py-3">${user.name}</td>
        <td class="px-4 py-3">${user.email}</td>
        <td class="px-4 py-3">${user.roles.map(role => role.name).join(", ")}</td>
        <td class="px-4 py-3 flex items-center justify-between">
            <button class="editUserBtn flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" 
                data-user-id="${user.id}" 
                data-user-name="${user.name}" 
                data-user-email="${user.email}" 
                aria-label="Edit">
                <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                </svg>
            </button>
            <button class="deleteUserBtn flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" 
                data-user-id="${user.id}" 
                aria-label="Delete">
                <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </td>
    `;
}



function attachEventListeners() {
    const token = localStorage.getItem('token');
    document.querySelectorAll('.deleteUserBtn').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            deleteUser(userId, token);
        });
    });

    document.querySelectorAll('.editUserBtn').forEach(button => {
        button.addEventListener('click', function() {
            const user = {
                id: this.getAttribute('data-user-id'),
                name: this.getAttribute('data-user-name'),
                email: this.getAttribute('data-user-email')
            };
            showEditForm(user);
        });
    });
}

function deleteUser(userId, token) {
    fetch(`http://localhost:8000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            console.log('User deleted successfully');
            location.reload();
        } else {
            console.error('Failed to delete user');
        }
    })
    .catch(error => console.error('Error:', error));
}



function showEditForm(user) {
    document.getElementById('updateUserId').value = user.id;
    document.getElementById('updateUserName').value = user.name;
    document.getElementById('updateUserEmail').value = user.email;
    document.getElementById('updateUserRole').innerHTML = '<option value="">Select Role</option>';
    const token = localStorage.getItem('token');
    fetchRoles(token);
    document.getElementById('updateUserModal').style.display = 'flex'; // Change this to flex to work with new CSS
}



function updateUser(token) {
    const userId = document.getElementById('updateUserId').value;
    const name = document.getElementById('updateUserName').value;
    const email = document.getElementById('updateUserEmail').value;
    const role = document.getElementById('updateUserRole').value; // Assuming role update is needed

    fetch(`http://localhost:8000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, role }), // Include all fields to update
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to update user');
        }
    })
    .then(data => {
        console.log('User updated successfully:', data);
        // Close the modal and refresh the user list to show changes
        document.getElementById('updateUserModal').style.display = 'none';
        fetchUsers(token); // Refresh the user list
    })
    .catch(error => console.error('Error:', error));
}


function fetchRoles(token) {
    fetch('http://localhost:8000/api/roles', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        const roleSelect = document.getElementById('updateUserRole');
        data.forEach(role => {
            const option = document.createElement('option');
            option.value = role.name;
            option.innerText = role.name;
            roleSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error:', error));
}


function assignUserRole(token, userId) {
    const role = document.getElementById('updateUserRole').value;
    fetch(`http://localhost:8000/api/users/${userId}/assign-role`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Role assigned successfully:', data);
        location.reload();
    })
    .catch(error => console.error('Error in role assignment:', error));
}