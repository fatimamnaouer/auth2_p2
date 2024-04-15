document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    fetchRoles(token);
    document.getElementById('createRoleForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const roleName = document.getElementById('createRoleName').value;
        if (roleName) {
            createRole(roleName);
        }
    });
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('editRoleModal').classList.add('hidden');
    });
});

function fetchRoles(token) {
    fetch('http://localhost:8000/api/roles', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => displayRoles(data))
    .catch(error => console.error('Error:', error));
}

function displayRoles(roles) {
    const rolesList = document.getElementById('rolesList');
    rolesList.innerHTML = ''; // Clear list to avoid duplicates on reload
    
    roles.forEach(role => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-3 px-6 text-left">${role.id}</td>
            <td class="py-3 px-6 text-left">${role.name}</td>
            <td class="py-3 px-6 text-center">
                <button class="editRoleBtn px-4 py-2 text-purple-600 hover:text-purple-900" data-role-id="${role.id}" data-role-name="${role.name}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="deleteRoleBtn px-4 py-2 text-red-600 hover:text-red-900" data-role-id="${role.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
                <button class="assignPermissionsBtn px-4 py-2 text-blue-600 hover:text-blue-900" data-role-id="${role.id}">
                    <i class="fas fa-user-shield"></i>
                </button>
            </td>
        `;
        rolesList.appendChild(row);
    });
    
    attachRoleEventListeners();
}





function createRole(roleName) {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/api/roles', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: roleName }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Rôle créé avec succès:', data);
        // Optionnellement, rafraîchir la liste des rôles ou ajouter le nouveau rôle à la vue sans recharger la page
        location.reload(); // Pour une mise à jour simple, rechargez la page
    })
    .catch(error => console.error('Erreur lors de la création du rôle:', error));
}

function attachDeleteRoleEventListeners() {
    const deleteButtons = document.querySelectorAll('.deleteRoleBtn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const roleId = this.getAttribute('data-role-id');
            if (confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) {
                deleteRole(roleId);
            }
        });
    });
}



function deleteRole(roleId) {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/api/roles/${roleId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            console.log('Rôle supprimé avec succès');
            location.reload(); // Recharger la page pour mettre à jour la liste des rôles
        } else {
            throw new Error('Erreur lors de la suppression du rôle');
        }
    })
    .catch(error => console.error('Erreur:', error));
}


function attachRoleEventListeners() {
    document.querySelectorAll('.deleteRoleBtn').forEach(button => {
        button.addEventListener('click', function() {
            const roleId = this.getAttribute('data-role-id');
            if (confirm('Are you sure you want to delete this role?')) {
                deleteRole(roleId);
            }
        });
    });

    document.querySelectorAll('.editRoleBtn').forEach(button => {
        button.addEventListener('click', function() {
            const roleId = this.getAttribute('data-role-id');
            const roleName = this.getAttribute('data-role-name');
            showEditForm(roleId, roleName);
        });
    });
}

function showEditForm(roleId, roleName) {
    document.getElementById('editRoleId').value = roleId;
    document.getElementById('editRoleName').value = roleName;
    document.getElementById('editRoleModal').classList.remove('hidden'); // Show the modal
}



document.getElementById('editRoleForm').addEventListener('submit', function(e) {
    e.preventDefault();
    updateRole();
});





function updateRole() {
    const roleId = document.getElementById('editRoleId').value;
    const roleName = document.getElementById('editRoleName').value;
    const token = localStorage.getItem('token');

    fetch(`http://localhost:8000/api/roles/${roleId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: roleName }),
    })
    .then(response => {
        if (response.ok) {
            console.log('Role updated successfully');
            location.reload();
        } else {
            throw new Error('Failed to update role');
        }
    })
    .catch(error => console.error('Error:', error));
}






document.getElementById('assignPermissionsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const roleId = document.getElementById('assignToRoleId').value;
    let permissionIds = [];
    document.querySelectorAll('#permissionsList input[type="checkbox"]:checked').forEach(checkbox => {
        permissionIds.push(parseInt(checkbox.value));
    });
    assignPermissions(roleId, permissionIds);
});

function closePermissionsModal() {
    document.getElementById('assignPermissionsModal').classList.add('hidden');
}

document.getElementById('assignPermissionsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const roleId = document.getElementById('assignToRoleId').value;
    let permissionIds = [];
    document.querySelectorAll('#permissionsList input[type="checkbox"]:checked').forEach(checkbox => {
        permissionIds.push(parseInt(checkbox.value));
    });
    assignPermissions(roleId, permissionIds);
});

function fetchPermissions() {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/api/permissions', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(permissions => {
        displayPermissionsInModal(permissions);
    })
    .catch(error => console.error('Error:', error));
}

function displayPermissionsInModal(permissions) {
    const list = document.getElementById('permissionsList');
    list.innerHTML = '';
    permissions.forEach(permission => {
        const label = document.createElement('label');
        label.className = 'block';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = permission.id;
        label.appendChild(checkbox);
        label.append(permission.name);
        list.appendChild(label);
    });
}

function assignPermissions(roleId, permissionIds) {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8000/api/roles/${roleId}/permissions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permissions: permissionIds }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Permissions assigned successfully:', data);
        closePermissionsModal(); // Optionally close the modal on success
    })
    .catch(error => console.error('Error:', error));
}

function openPermissionsModal(roleId) {
    document.getElementById('assignToRoleId').value = roleId;
    fetchPermissions(); // Fetch permissions when opening the modal
    document.getElementById('assignPermissionsModal').classList.remove('hidden');
}

function closePermissionsModal() {
    document.getElementById('assignPermissionsModal').classList.add('hidden');
}







function attachRoleEventListeners() {
    document.querySelectorAll('.deleteRoleBtn').forEach(button => {
        button.addEventListener('click', function() {
            const roleId = this.getAttribute('data-role-id');
            if (confirm('Are you sure you want to delete this role?')) {
                deleteRole(roleId);
            }
        });
    });

    document.querySelectorAll('.editRoleBtn').forEach(button => {
        button.addEventListener('click', function() {
            const roleId = this.getAttribute('data-role-id');
            const roleName = this.getAttribute('data-role-name');
            showEditForm(roleId, roleName);
        });
    });

    document.querySelectorAll('.assignPermissionsBtn').forEach(button => {
        button.addEventListener('click', function() {
            const roleId = this.getAttribute('data-role-id');
            openPermissionsModal(roleId);
        });
    });
}




function openPermissionsModal(roleId) {
    document.getElementById('assignToRoleId').value = roleId;
    fetchPermissions();  // Ensure this fetches and displays with checkboxes already checked for assigned permissions if needed.
    document.getElementById('assignPermissionsModal').classList.remove('hidden');
}
