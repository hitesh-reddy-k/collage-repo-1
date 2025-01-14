document.addEventListener("DOMContentLoaded", async function() {
    try {
        const token = getToken(); 
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        const response = await fetch('https://collage-repo-1.vercel.app/student/me', {
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
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});

function getToken() {
    return localStorage.getItem('token');
}
