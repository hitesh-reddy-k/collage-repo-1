const token = localStorage.getItem("token");

async function handleJoinClub() {
    const clubId = document.getElementById("clubId").value;
    const messageElement = document.getElementById("message");
    messageElement.textContent = "";

    try {
        const response = await fetch("http://localhost:5000//clubs/join", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,

            },
            body: JSON.stringify({ clubId }),
        });

        const data = await response.json();
        messageElement.textContent = data.message || "Successfully joined the club!";
    } catch (error) {
        messageElement.textContent = "Error joining the club: " + error.message;
    }
}

async function handleLeaveClub() {
    const clubId = document.getElementById("clubId").value;
    const messageElement = document.getElementById("message");
    messageElement.textContent = "";

    try {
        const response = await fetch("http://localhost:5000/api/clubs/leave", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ clubId }),
        });

        const data = await response.json();
        messageElement.textContent = data.message || "Successfully left the club!";
    } catch (error) {
        messageElement.textContent = "Error leaving the club: " + error.message;
    }
}