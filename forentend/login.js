document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginButton');

    if (loginButton) {
        loginButton.addEventListener('click', function (event) {
            event.preventDefault();

            const email = document.getElementById('Email').value;
            const password = document.getElementById('password').value;

            clearErrorMessages();

            let hasError = false;

            if (!email) {
                showError('emailError', 'Please enter an email.');
                hasError = true;
            }
            if (!password) {
                showError('passwordError', 'Please enter a password.');
                hasError = true;
            }
            if (hasError) {
                return;
            }

            const data = {
                Email: email,
                password: password,
            };

            fetch('http://localhost:3000/student/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
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
                        localStorage.setItem('userId', data.userId); // Fix here

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
        });
    } else {
        console.error('Login button not found');
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
    }

    function clearErrorMessages() {
        document.querySelectorAll('.error').forEach((element) => {
            element.textContent = '';
        });
    }
});
