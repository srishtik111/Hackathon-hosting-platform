async function generateInviteLink(event) {
    event.preventDefault();

    const teamName = document.getElementById("team-name").value.trim();
    const teamSize = document.getElementById("team-size").value.trim();
    const members = [];

    // ✅ Collect team member data dynamically
    for (let i = 1; i <= teamSize; i++) {
        const name = document.querySelector(`[name=memberName${i}]`).value;
        const email = document.querySelector(`[name=memberEmail${i}]`).value;
        members.push({ name, email });
    }

    if (teamName === "" || members.length === 0) {
        alert("❌ Please enter team name and members.");
        return;
    }

    try {
        // ✅ Send data to backend API
        const response = await fetch("http://localhost:5000/api/teams/create-team", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                teamName,
                members
            })
        });

        const data = await response.json();

        if (response.ok && data.inviteLink) {
            // ✅ Show invite link
            const inviteInput = document.getElementById("invite-link");
            inviteInput.dataset.link = `http://localhost:5000/join?team=${teamName}&token=${data.inviteLink}`;
            inviteInput.value = inviteInput.dataset.link;
            document.getElementById("invite-container").style.display = "block";

            // ✅ Show success popup
            showPopup(data.inviteLink);
        } else {
            alert(data.error || "❌ Failed to create team.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Server not responding.");
    }
}

function showPopup(link) {
    const popup = document.getElementById("main2");
    popup.classList.remove("hide");

    // ✅ Update popup content
    const popupText = document.getElementById("popup13");
    popupText.innerHTML = `
        <p>✅ Team Created Successfully</p>
        <span>Share the invite link:</span>
        <input type="text" value="${link}" readonly>
        <br><br>
        <button onclick="copyInviteLink()">Copy Link</button>
        <button onclick="redirectToHome()">Go to Home Page</button>
    `;
}

// ✅ Copy invite link to clipboard
function copyInviteLink() {
    const inviteButton = document.getElementById("invite-link");
    navigator.clipboard.writeText(inviteButton.value)
        .then(() => alert("✅ Invite link copied successfully!"))
        .catch(err => alert("❌ Failed to copy invite link."));
}

// ✅ Close the popup
function closePopup() {
    document.getElementById("main2").classList.add("hide");
}

// ✅ Redirect to the home page
function redirectToHome() {
    window.location.href = "../dashboard.html";
}

// ✅ Handle Join Team Function
async function joinTeam() {
    const inputField = document.querySelector(".sign-in-form .input-field");
    const inputText = inputField.value.trim();
    const userId = localStorage.getItem("userId");

    if (!inputText) {
        alert("❌ Enter a valid team name or invite link.");
        return;
    }
    if (!userId) {
        alert("❌ You must be logged in to join a team.");
        return;
    }

    let teamName, inviteToken;
    if (inputText.includes("token=")) {
        const urlParams = new URLSearchParams(inputText.split("?")[1]);
        teamName = urlParams.get("team");
        inviteToken = urlParams.get("token");
    } else {
        teamName = inputText;
        inviteToken = null;
    }

    try {
        const response = await fetch("http://localhost:5000/api/teams/join-team", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teamName, inviteToken, userId })
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Successfully joined the team!");
            window.location.href = "dashboard.html";
        } else {
            alert(data.error || "❌ Failed to join the team.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Server not responding.");
    }
}
