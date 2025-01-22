const token = localStorage.getItem("token");

async function handleJoinClub() {
    const clubId = document.getElementById("clubId").value;
    const messageElement = document.getElementById("message");
    messageElement.textContent = "";

    try {
        const response = await fetch("http://localhost:5000/clubs/join", {
            method: "POST",
            credentials: "include",
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
        const response = await fetch("http://localhost:5000/clubs/leave", {
            method: "POST",
            credentials: "include",
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

async function handleCreateClub() {
    const clubName = document.getElementById("clubName").value;
    const clubPost = document.getElementById("clubPost").value;
    const createMessageElement = document.getElementById("createMessage");
    createMessageElement.textContent = "";

    try {
        const response = await fetch("http://localhost:5000/clubs/create", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ clubName, post: clubPost }),
        });

        const data = await response.json();
        createMessageElement.textContent = data.message || "Club created successfully!";
    } catch (error) {
        createMessageElement.textContent = "Error creating the club: " + error.message;
    }
}
