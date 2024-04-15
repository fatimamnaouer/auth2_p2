document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const password_confirmation = document.getElementById('registerPasswordConfirm').value;

    fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, password_confirmation }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        localStorage.setItem('token', data.access_token);
        window.location.href = 'login.html'; // Redirigez vers la page de connexion après l'inscription
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
