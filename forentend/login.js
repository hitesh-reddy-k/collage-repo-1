fetch('https://collage-repo-1.vercel.app/student/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include', // Include cookies
})
    .then((response) => {
        if (!response.ok) {
            return response.json().then((errorData) => {
                throw new Error(errorData.message);
            });
        }
        return response.json();
    })
    .then((data) => {
        if (data.success) {
            console.log(data);

            // Store token, role, and userId in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('userId', data.userId);

            // Redirect based on user role
            if (data.user.role === 'ADMIN') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'main.html';
            }
        } else {
            showError('loginError', data.message);
        }
    })
    .catch((error) => {
        console.error('Login Error:', error);
        showError('loginError', 'Incorrect email or password');
    });
