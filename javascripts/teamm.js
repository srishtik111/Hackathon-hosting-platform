async function generateInviteLink(event) {
    event.preventDefault();

    const teamName = document.getElementById("team-name").value.trim();
    const userId = localStorage.getItem("userId");

    if (teamName === "") {
        alert("Please enter a team name.");
        return;
    }
    if (!userId) {
        alert("You must be logged in to create a team.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/create-team", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: teamName, userId }),
        });

        const data = await response.json();
        console.log(data); // Debugging

        if (response.ok && data.inviteLink) {
            const inviteInput = document.getElementById("invite-link");
            inviteInput.dataset.link = `http://localhost:5000/join?team=${teamName}&token=${data.inviteLink}`;
            inviteInput.value = inviteInput.dataset.link; // Show the actual link
            document.getElementById("invite-container").style.display = "block"; // Show invite section
        } else {
            alert(data.error || "Error creating team");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Server not responding. Check console for details.");
    }
}
 

async function joinTeam() {
    const inputField = document.querySelector(".sign-in-form .input-field");
    const inputText = inputField.value.trim();
    const userId = localStorage.getItem("userId");

    if (!inputText) {
        alert("Enter a valid team name or invite link.");
        return;
    }
    if (!userId) {
        alert("You must be logged in to join a team.");
        return;
    }

    let teamName, inviteToken;
    if (inputText.includes("token=")) {
        const urlParams = new URLSearchParams(inputText.split("?")[1]);
        teamName = urlParams.get("team");
        inviteToken = urlParams.get("token");
    } else {
        teamName = inputText; // User entered a team name manually
        inviteToken = null; // No token, normal team name validation
    }

    try {
        const response = await fetch("http://localhost:5000/join-team", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teamName, inviteToken, userId }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Successfully joined the team!");
            window.location.href = "dashboard.html"; // Redirect after joining
        } else {
            alert(data.error || "Team does not exist. Please check the name or invite link.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Server not responding. Check console for details.");
    }
}


// When clicking "Invite Link" button, show the actual URL
document.getElementById("invite-link").addEventListener("click", function () {
    if (this.dataset.link) {
        this.value = this.dataset.link; // Replace "Invite Link" with the actual URL
    }
});

// Function to copy invite link
function copyInviteLink() {
    const inviteButton = document.getElementById("invite-link");

    // Get the actual invite link
    const actualLink = inviteButton.dataset.link;

    if (!actualLink) {
        alert("No invite link available to copy!");
        return;
    }

    // Copy the link to clipboard
    navigator.clipboard.writeText(actualLink)
        .then(() => {
            alert("Invite link copied!");
        })
        .catch(err => {
            console.error("Failed to copy:", err);
            alert("Failed to copy invite link.");
        });
}


function showPopup() {
    const popup = document.getElementById("main2");
    popup.classList.remove("hide");

    // Update popup content
    const popupText = document.getElementById("popup13");
    popupText.innerHTML = `
        <p>Team Created Successfully&nbsp;
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="#63E6BE" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
            </svg>
        </p>
        <span>Click below to go to the home page if you want.</span>
        <br><br>
        <button onclick="redirectToHome()" style="padding: 10px 20px; background-color: #28a745; color: white; border: none; cursor: pointer; border-radius: 5px;">
            Go to Home Page
        </button>
        <br><br>
        <button onclick="closePopup()" style="padding: 10px 20px; background-color: #dc3545; color: white; border: none; cursor: pointer; border-radius: 5px;">
            Close
        </button>
    `;
}

function closePopup() {
    document.getElementById("main2").classList.add("hide");
}

function redirectToHome() {
    window.location.href = "../pg.html";
}
