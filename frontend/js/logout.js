document.getElementById('logoutButton').addEventListener('click', function() {
    const token = localStorage.getItem('token');

    if (token) {
        fetch('http://localhost:8000/api/logout', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                // Assuming the server successfully processed the logout
                console.log("Logged out successfully");
                // Clear the token from local storage (or cookies if you use them)
                localStorage.removeItem('token');

                // Redirect the user to the login page or update UI accordingly
                window.location.href = 'login.html';
            } else {
                throw new Error('Logout failed');
            }
        })
        .catch(error => console.error('Error:', error));
    }
});
