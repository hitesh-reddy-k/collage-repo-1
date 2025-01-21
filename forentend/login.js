document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginButton');

    if(token){
        window.location.href = 'main.html';
    }

    if (loginButton) {
        loginButton.addEventListener('click', function (event) {
            event.preventDefault();

            const email = document.getElementById('Email').value;
            const password = document.getElementById('password').value;

            clearErrorMessages();

            if (!email || !password) {
                if (!email) showError('emailError', 'Please enter an email.');
                if (!password) showError('passwordError', 'Please enter a password.');
                return;
            }

            const data = { Email: email, password: password };

            fetch('https://collage-repo-1.vercel.app/student/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Include cookies for cross-origin
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
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('role', data.role);
                        localStorage.setItem('userId', data.userId);

                        const redirectURL = data.user.role === 'ADMIN' ? 'admin.html' : 'main.html';
                        window.location.href = redirectURL;
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
        if (errorElement) errorElement.textContent = message;
    }

    function clearErrorMessages() {
        document.querySelectorAll('.error').forEach((element) => {
            element.textContent = '';
        });
    }
});
