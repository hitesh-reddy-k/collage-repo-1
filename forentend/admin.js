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
        localStorage.setItem('role',userData.users.role)
        

        
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



function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}
