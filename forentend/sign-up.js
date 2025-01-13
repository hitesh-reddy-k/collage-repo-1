document.getElementById('signupButton').addEventListener('click', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const rollNumber = document.getElementById('RollNumber').value;
  const password = document.getElementById('password').value;
  const conformPassword = document.getElementById('conformpassword').value;
  const email = document.getElementById('Email').value;
  const phoneNumber = document.getElementById('PhoneNumber').value;

  // Clear previous error messages
  clearErrorMessages();

  let hasError = false;

  // Data validation
  if (!username) {
      showError('username', 'Please enter a username.');
      hasError = true;
  }
  if (!rollNumber) {
      showError('RollNumber', 'Please enter a roll number.');
      hasError = true;
  }
  if (!password) {
      showError('password', 'Please enter a password.');
      hasError = true;
  }
  if (!conformPassword) {
      showError('conformpassword', 'Please confirm your password.');
      hasError = true;
  }
  if (password !== conformPassword) {
      showError('conformpassword', 'Passwords do not match.');
      hasError = true;
  }
  if (!email) {
      showError('Email', 'Please enter an email.');
      hasError = true;
  }
  if (!phoneNumber) {
      showError('PhoneNumber', 'Please enter a phone number.');
      hasError = true;
  }

  if (hasError) {
      return;
  }

  // Data to be sent to the server
  const data = {
      Username: username,
      RollNumber: rollNumber,
      password: password,
      conformpassword: conformPassword,
      Email: email,
      PhoneNumber: phoneNumber
  };

  // Send data to the server
  fetch('http://localhost:3000/student/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
      console.log('Success:', data);
      if (data.success) {
          alert('Sign up successful!');
      } else {
          // Display error message returned by the server
          document.getElementById('usernameError').textContent = data.message;
      }
  })
  .catch((error) => {
      console.error('Error:', error);
      document.getElementById('usernameError').textContent = 'Sign up failed: An error occurred';
  });
});

function showError(inputId, message) {
  const inputElement = document.getElementById(inputId);
  const errorElement = document.createElement('span');
  errorElement.className = 'error';
  errorElement.textContent = message;
  inputElement.parentNode.appendChild(errorElement);
}

function clearErrorMessages() {
  const errorElements = document.querySelectorAll('.error');
  errorElements.forEach(function(element) {
      element.remove();
  });
}
