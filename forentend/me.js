function getToken() {
    return localStorage.getItem('token');
}

document.addEventListener("DOMContentLoaded", async function() {
    try {
        const token = getToken();
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch('http://localhost:3000/student/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }

        const responseData = await response.json();
        const userData = responseData.users;

        updateFields(userData);

    } catch (error) {
        console.log('Error fetching user details:', error.message);
    }
});

function updateFields(userData) {
    updateField("full-name", userData.Username);
    updateField("position", userData.position);
    updateField("Roll-Number", userData.RollNumber);
    updateField("username", userData.Username);
    updateField("email", userData.Email);
    updateField("phone", userData.PhoneNumber);
    updateField("description", userData.description);
    updateField("linkedin", userData.linkedIn);

    updateProgressBar("web-design", userData.attendancePercentage);
}

function updateField(elementId, value, defaultValue = "") {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || defaultValue;
    } else {
        console.log(`Element with ID '${elementId}' not found`);
    }
}

function updateProgressBar(elementId, width) {
    const progressBar = document.getElementById(elementId);
    if (progressBar) {
        progressBar.style.width = width || "50%";
    } else {
        console.log(`Progress bar with ID '${elementId}' not found`);
    }
}

function editInfo() {
    document.getElementById("username").style.display = "none";
    document.getElementById("edit-username").style.display = "block";
    document.getElementById("edit-username").value = document.getElementById("username").innerHTML;

    document.getElementById("phone").style.display = "none";
    document.getElementById("edit-phone").style.display = "block";
    document.getElementById("edit-phone").value = document.getElementById("phone").innerHTML;

    document.getElementById("linkedin").style.display = "none";
    document.getElementById("edit-linkedin").style.display = "block";
    document.getElementById("edit-linkedin").value = document.getElementById("linkedin").innerHTML;

    document.getElementById("description").style.display = "none";
    document.getElementById("edit-description").style.display = "block";
    document.getElementById("edit-description").value = document.getElementById("description").innerHTML;

    document.querySelector(".edit-btn").style.display = "none";
    document.querySelector(".save-btn").style.display = "block";
}

async function saveInfo() {
    const updatedUsername = document.getElementById("edit-username").value;
    const updatedPhone = document.getElementById("edit-phone").value;
    const updatedLinkedIn = document.getElementById("edit-linkedin").value;
    const updatedDescription = document.getElementById("edit-description").value;

    try {
        const token = getToken();
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        // Update Username
        const updatedDataUsername = { Username: updatedUsername };
        const responseUsername = await fetch('http://localhost:3000/student/update/UserName', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedDataUsername),
            credentials: 'include'
        });

        if (!responseUsername.ok) {
            const errorResponse = await responseUsername.json();
            throw new Error(`Failed to update username: ${errorResponse.message}`);
        }

        updateField("username", updatedUsername);
        console.log('Username updated successfully');

    } catch (error) {
        console.log('Error updating username:', error.message);
    }

    try {
        const token = getToken();
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        // Update Phone Number
        const updatedDataPhone = { PhoneNumber: updatedPhone };
        const responsePhone = await fetch('http://localhost:3000/student/update/PhoneNumber', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedDataPhone),
            credentials: 'include'
        });

        if (!responsePhone.ok) {
            const errorResponse = await responsePhone.json();
            throw new Error(`Failed to update phone number: ${errorResponse.message}`);
        }

        updateField("phone", updatedPhone);
        console.log('Phone number updated successfully');

    } catch (error) {
        console.log('Error updating phone number:', error.message);
    }

    try {
        const token = getToken();
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        // Update LinkedIn
        const updatedDataLinkedIn = { linkedIn: updatedLinkedIn };
        const responseLinkedIn = await fetch('http://localhost:3000/student/update/LinkedIn', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedDataLinkedIn),
            credentials: 'include'
        });

        if (!responseLinkedIn.ok) {
            const errorResponse = await responseLinkedIn.json();
            throw new Error(`Failed to update LinkedIn username: ${errorResponse.message}`);
        }

        updateField("linkedin", updatedLinkedIn);
        console.log('LinkedIn username updated successfully');

    } catch (error) {
        console.log('Error updating LinkedIn username:', error.message);
    }

    try {
        const token = getToken();
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const updatedDataDescription = { description: updatedDescription };
        const responseDescription = await fetch('http://localhost:3000/student/update/description', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedDataDescription),
            credentials: 'include'
        });

        if (!responseDescription.ok) {
            const errorResponse = await responseDescription.json();
            throw new Error(`Failed to update description: ${errorResponse.message}`);
        }

        updateField("description", updatedDescription);
        console.log('Description updated successfully');
    } catch (error) {
        console.log('Error updating description:', error.message);
    }

    document.getElementById("username").style.display = "block";
    document.getElementById("edit-username").style.display = "none";

    document.getElementById("phone").style.display = "block";
    document.getElementById("edit-phone").style.display = "none";

    document.getElementById("linkedin").style.display = "block";
    document.getElementById("edit-linkedin").style.display = "none";

    document.getElementById("description").style.display = "block";
    document.getElementById("edit-description").style.display = "none";

    document.querySelector(".edit-btn").style.display = "block";
    document.querySelector(".save-btn").style.display = "none";
}
