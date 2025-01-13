document.addEventListener("DOMContentLoaded", async function() {
    try {
        // Function to get the stored token, replace with your actual method
        const getToken = () => {
            return localStorage.getItem('token'); // Assuming token is stored in localStorage
        };

        const token = getToken(); 
        if (!token) {
            window.location.href = 'login.html'; // Redirect to login if token is missing
            return;
        }


        // Fetch user details from the backend
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

        const userData = await response.json();
        console.log('User Data:', userData);

        // Get references to the DOM elements
        const userInfoElement = document.getElementById('userInfo');
        const attendanceElement = document.getElementById('attendanceData');
        const rollNumberElement = document.getElementById('rollNumber');
        const yearElement = document.getElementById('yearData');

            const usernameElement = document.querySelector('.username'); 
            if (usernameElement && userData.user && userData.user.Username) {
                    usernameElement.textContent = userData.user.Username; 
                } else {
                    console.error('Username element or user data not found');
                }


        if (attendanceElement) {
            attendanceElement.innerHTML = `<p>Attendance: ${userData.user.Attendance}%</p>`;
        }

        if (rollNumberElement) {
            rollNumberElement.innerHTML = `<p>Roll Number: ${userData.user.RollNumber}</p>`;
        }

        if (yearElement) {
            yearElement.innerHTML = `<p>Year: ${userData.user.Year}</p>`;
        }

    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});

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

        const userData = await response.json();
        console.log('User Data:', userData);

        const notificationsList = document.getElementById("notificationsList");
        const notificationsKey = `notifications_${userData.users.id}`;
        const notifications = JSON.parse(localStorage.getItem(notificationsKey)) || [];

        notifications.forEach(notification => {
            const listItem = document.createElement("li");
            const link = document.createElement("a");
            link.href = notification.link;
            link.textContent = notification.message;
            listItem.appendChild(link);
            notificationsList.appendChild(listItem);
        });

        // Update notification count
        const notificationCount = document.getElementById("notificationCount");
        notificationCount.textContent = notifications.length;

        // Add event listener to reset notification count when notifications panel is viewed
        const notificationsPanel = document.getElementById("notificationsPanel");
        notificationsPanel.addEventListener("click", function() {
            // Clear notifications for the current user
            localStorage.setItem(notificationsKey, JSON.stringify([]));
            notificationCount.textContent = 0;

            // Clear the displayed notifications
            while (notificationsList.firstChild) {
                notificationsList.removeChild(notificationsList.firstChild);
            }
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});

function getToken() {
    return localStorage.getItem('token');
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "250px";
    }
}

function addNotification(userId, message, link) {
    const notificationsKey = `notifications_${userId}`;
    const notifications = JSON.parse(localStorage.getItem(notificationsKey)) || [];
    notifications.push({ message, link });
    localStorage.setItem(notificationsKey, JSON.stringify(notifications));

    const notificationCount = document.getElementById("notificationCount");
    notificationCount.textContent = notifications.length;
}

document.addEventListener("DOMContentLoaded", async function() {
    console.log("Student Dashboard loaded");

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

        const userData = await response.json();
        console.log('User Data:', userData);

        const usernameElement = document.getElementById('username');

        if (usernameElement && userData.user && userData.user.Username) {
            usernameElement.textContent = userData.user.Username; // Set the username text
            
        }

        const userInfoElement = document.getElementById('userInfo');
        if (userInfoElement && userData.user && userData.user.Username) {
            userInfoElement.textContent = userData.user.Username; 
        } else {
            console.error('Username element or user data not found');
        }

        addNotification(userData.users.id, 'rcb date dinesh', 'main.html');

       
        const notificationsKey = `notifications_${userData.users.id}`;
        const notifications = JSON.parse(localStorage.getItem(notificationsKey)) || [];
        const notificationCount = document.getElementById("notificationCount");
        notificationCount.textContent = notifications.length;

    } catch (error) {
        console.error('Error fetching user data:', error);
    }
    
    document.addEventListener("click", function(event) {
        let sidebar = document.getElementById("sidebar");
        let menuBar = document.querySelector(".menu-bar");
        if (sidebar.style.width === "250px" && !sidebar.contains(event.target) && !menuBar.contains(event.target)) {
            sidebar.style.width = "0";
        }
    });
});

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "250px";
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// Close sidebar if clicked outside
document.addEventListener("click", function(event) {
    let sidebar = document.getElementById("sidebar");
    let menuBar = document.querySelector(".menu-bar");
    if (sidebar.style.width === "250px" && !sidebar.contains(event.target) && !menuBar.contains(event.target)) {
        sidebar.style.width = "0";
    }
});


function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}
