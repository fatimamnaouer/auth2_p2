// function fetchPermissions() {
//     const token = localStorage.getItem('token');
//     fetch('http://localhost:8000/api/permissions', {
//         method: 'GET',
//         headers: {
//             'Authorization': 'Bearer ' + token,
//             'Content-Type': 'application/json',
//         },
//     })
//     .then(response => response.json())
//     .then(permissions => displayPermissions(permissions)) // Update this line to call displayPermissions
//     .catch(error => console.error('Error:', error));
// }

// function displayPermissions(permissions) {
//     const permissionsTableBody = document.getElementById('permissionsTable').getElementsByTagName('tbody')[0];
//     permissionsTableBody.innerHTML = ''; // Clear existing rows
//     permissions.forEach(permission => {
//         let row = permissionsTableBody.insertRow();
//         let name = row.insertCell(0);
//         name.innerHTML = permission.name;

//         let actions = row.insertCell(1);
//         actions.innerHTML = `<button class="editPermissionBtn" data-permission-id="${permission.id}" data-permission-name="${permission.name}">Edit</button> 
//                              <button class="deletePermissionBtn" data-permission-id="${permission.id}">Delete</button>`;
//     });

//     attachPermissionEventListeners(); // We'll define this function next
// }




// document.getElementById('addPermissionForm').addEventListener('submit', function(e) {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     const permissionName = document.getElementById('newPermissionName').value;

//     fetch('http://localhost:8000/api/permissions', {
//         method: 'POST',
//         headers: {
//             'Authorization': 'Bearer ' + token,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name: permissionName }),
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Permission added:', data);
//         fetchPermissions(); // Refresh the list of permissions
//     })
//     .catch(error => console.error('Error:', error));
// });

// document.addEventListener('DOMContentLoaded', function() {
//     document.getElementById('showAddPermissionModal').addEventListener('click', function() {
//         document.getElementById('addPermissionModal').style.display = 'block';
//     });
//     fetchPermissions();
// });


// function attachPermissionEventListeners() {
//     document.querySelectorAll('.deletePermissionBtn').forEach(button => {
//         button.addEventListener('click', function() {
//             const permissionId = this.getAttribute('data-permission-id');
//             deletePermission(permissionId);
//         });
//     });
// }

// function deletePermission(permissionId) {
//     const token = localStorage.getItem('token');
//     fetch(`http://localhost:8000/api/permissions/${permissionId}`, {
//         method: 'DELETE',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//         },
//     })
//     .then(response => {
//         if (response.ok) {
//             console.log('Permission deleted successfully');
//             fetchPermissions(); // Refresh the permissions list
//         } else {
//             console.error('Failed to delete permission');
//         }
//     })
//     .catch(error => console.error('Error:', error));
// }


// function attachPermissionEventListeners() {
//     document.querySelectorAll('.editPermissionBtn').forEach(button => {
//         button.addEventListener('click', function() {
//             const permissionId = this.getAttribute('data-permission-id');
//             const permissionName = this.getAttribute('data-permission-name');
//             document.getElementById('editPermissionId').value = permissionId;
//             document.getElementById('editPermissionName').value = permissionName;
//             // Show your modal here
//         });
//     });
// }


// document.getElementById('editPermissionForm').addEventListener('submit', function(e) {
//     e.preventDefault();
//     const permissionId = document.getElementById('editPermissionId').value;
//     const permissionName = document.getElementById('editPermissionName').value;
//     updatePermission(permissionId, permissionName);
// });

// function updatePermission(permissionId, permissionName) {
//     const token = localStorage.getItem('token');
//     fetch(`http://localhost:8000/api/permissions/${permissionId}`, {
//         method: 'PUT',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name: permissionName }),
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Permission updated:', data);
//         fetchPermissions(); // Refresh the permissions list
//     })
//     .catch(error => console.error('Error:', error));
// }

// function showEditModal() {
//     document.getElementById('editPermissionModal').style.display = 'block';
// }


// function attachPermissionEventListeners() {
//     document.querySelectorAll('.editPermissionBtn').forEach(button => {
//         button.addEventListener('click', function() {
//             const permissionId = this.getAttribute('data-permission-id');
//             const permissionName = this.getAttribute('data-permission-name');
//             document.getElementById('editPermissionId').value = permissionId;
//             document.getElementById('editPermissionName').value = permissionName;
//             showEditModal();
//         });
//     });

//     // Close modal functionality
//     document.querySelector('.close-button').addEventListener('click', function() {
//         document.getElementById('editPermissionModal').style.display = 'none';
//     });
// }



// document.getElementById('editPermissionForm').addEventListener('submit', function(e) {
//     e.preventDefault();
//     const permissionId = document.getElementById('editPermissionId').value;
//     const permissionName = document.getElementById('editPermissionName').value;
//     updatePermission(permissionId, permissionName);
//     document.getElementById('editPermissionModal').style.display = 'none'; // Hide modal after submission
// });






document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    fetchPermissions(token);
    document.getElementById('createPermissionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const permissionName = document.getElementById('createPermissionName').value;
        if (permissionName) {
            createPermission(permissionName);
        }
    });
});

function fetchPermissions(token) {
    fetch('http://localhost:8000/api/permissions', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => displayPermissions(data))
    .catch(error => console.error('Error:', error));
}

function displayPermissions(permissions) {
    const permissionsList = document.getElementById('permissionsList');
    permissionsList.innerHTML = '';

    permissions.forEach(permission => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-3 px-6 text-left">${permission.id}</td>
            <td class="py-3 px-6 text-left">${permission.name}</td>
            <td class="py-3 px-6 text-center">
                <button class="editPermissionBtn px-4 py-2 text-purple-600 hover:text-purple-900" data-permission-id="${permission.id}" data-permission-name="${permission.name}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="deletePermissionBtn px-4 py-2 text-red-600 hover:text-red-900" data-permission-id="${permission.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        permissionsList.appendChild(row);
    });

    attachDeletePermissionEventListeners();
    attachEditPermissionEventListeners();
}

function createPermission(permissionName) {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/api/permissions', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: permissionName }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Permission created successfully:', data);
        location.reload(); // For a simple update, reload the page
    })
    .catch(error => console.error('Error during permission creation:', error));
}

function attachDeletePermissionEventListeners() {
    const deleteButtons = document.querySelectorAll('.deletePermissionBtn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const permissionId = this.getAttribute('data-permission-id');
            if (confirm('Are you sure you want to delete this permission?')) {
                deletePermission(permissionId);
            }
        });
    });
}

function deletePermission(permissionId) {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/api/permissions/${permissionId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            console.log('Permission deleted successfully');
            location.reload();
        } else {
            throw new Error('Failed to delete permission');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to show the edit form with current permission name
function showEditForm(permissionId, permissionName) {
    const editPermissionModal = document.getElementById('editPermissionModal');
    document.getElementById('editPermissionId').value = permissionId;
    document.getElementById('editPermissionName').value = permissionName;
    editPermissionModal.style.display = 'block';
}

// Attach event listeners to edit buttons
function attachEditPermissionEventListeners() {
    const editButtons = document.querySelectorAll('.editPermissionBtn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const permissionId = this.getAttribute('data-permission-id');
            const permissionName = this.getAttribute('data-permission-name');
            showEditForm(permissionId, permissionName);
        });
    });
}


// Function to update permission on the server
function updatePermission() {
    const permissionId = document.getElementById('editPermissionId').value;
    const permissionName = document.getElementById('editPermissionName').value;
    const token = localStorage.getItem('token');

    fetch(`http://localhost:8000/api/permissions/${permissionId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: permissionName }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Permission updated successfully:', data);
        location.reload();
    })
    .catch(error => console.error('Error updating permission:', error));
}

document.getElementById('editPermissionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    updatePermission();
});