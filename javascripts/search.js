const searchInput = document.getElementById('searchInput');
const hackathonContainer = document.getElementById('hackathonContainer');

searchInput.addEventListener('input', filterHackathons);

async function fetchHackathons() {
    const response = await fetch('http://localhost:5000/api/hackathons/all');
    const data = await response.json();
    hackathonContainer.innerHTML = '';

    if (data.length === 0) {
        hackathonContainer.innerHTML = `<p class="text-center text-red-500 text-xl">No Hackathons Available</p>`;
        return;
    }

    // ✅ Dynamically create cards
    data.forEach(hackathon => {
        const card = document.createElement('div');
        card.classList.add('card-container', 'bg-white', 'shadow-md', 'rounded-lg', 'overflow-hidden');
        card.innerHTML = `
            <div class="card-body">
                <h3 class="card-title">${hackathon.hack_name}</h3>
                <p class="card-info"><strong>Theme:</strong> ${hackathon.theme}</p>
                <p class="card-info"><strong>Description:</strong> ${hackathon.problem_statement}</p>
                <p class="card-info"><strong>Start Date:</strong> ${new Date(hackathon.start_date).toDateString()}</p>
                <p class="card-info"><strong>End Date:</strong> ${new Date(hackathon.end_date).toDateString()}</p>
                <p class="card-info"><strong>Prize:</strong> ₹${hackathon.prize}</p>
                <p class="card-info"><strong>Guidelines:</strong> ${hackathon.guidelines || 'Not Available'}</p>
                <p class="card-info"><strong>Participation Type:</strong> ${hackathon.participation_type}</p>
                ${
                    hackathon.participation_type === 'Team' ? 
                    `<p class="card-info"><strong>Team Size:</strong> Min: ${hackathon.min_team_size}, Max: ${hackathon.max_team_size}</p>` : ''
                }
            </div>
            <div class="card-footer">
                <a href="hackathon-info.html?id=${hackathon._id}" class="btn-register">
                    View Details
                </a>
            </div>
        `;
        hackathonContainer.appendChild(card);
    });

    // ✅ Now call the search function after cards are loaded
    filterHackathons();
}

function filterHackathons() {
    const query = searchInput.value.toLowerCase();
    let hasMatchingHackathon = false;
    const hackathons = document.querySelectorAll('.card-container');

    hackathons.forEach((hackathon) => {
        const name = hackathon.querySelector('.card-title').textContent.toLowerCase();
        const theme = hackathon.querySelector('.card-info:nth-child(2)').textContent.toLowerCase();
        
        if (name.includes(query) || theme.includes(query)) {
            hasMatchingHackathon = true;
            hackathon.style.display = 'block';
        } else {
            hackathon.style.display = 'none';
        }
    });

    // ✅ Show 'No Results Found' if nothing matches
    if (!hasMatchingHackathon) {
        hackathonContainer.innerHTML = `<p class="text-center text-red-500 text-xl">❌ No matching hackathons found</p>`;
    }
}

// ✅ Fetch Hackathons
fetchHackathons();
