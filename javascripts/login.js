const inputs = document.querySelectorAll(".input-field");
const toggle_btn = document.querySelectorAll(".toggle");
const main = document.querySelector("main");
const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");

inputs.forEach((inp) => {
  inp.addEventListener("focus", () => inp.classList.add("active"));
  inp.addEventListener("blur", () => {
    if (inp.value !== "") return;
    inp.classList.remove("active");
  });
});

toggle_btn.forEach((btn) => {
  btn.addEventListener("click", () => main.classList.toggle("sign-up-mode"));
});

function moveSlider() {
  let index = this.dataset.value;
  let currentImage = document.querySelector(`.img-${index}`);
  images.forEach((img) => img.classList.remove("show"));
  currentImage.classList.add("show");

  const textSlider = document.querySelector(".text-group");
  textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;

  bullets.forEach((bull) => bull.classList.remove("active"));
  this.classList.add("active");
}

bullets.forEach((bullet) => bullet.addEventListener("click", moveSlider));


document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".sign-up-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const userType = document.getElementById("signup-user-type").value;

    // ✅ Strict email validation with real domains
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|protonmail\.com|icloud\.com|rediffmail\.com|zoho\.com)$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email (e.g., Gmail, Yahoo, Outlook, Hotmail, etc.)");
      return;
    }

    // ✅ Password validation (at least 8 chars, 1 uppercase, 1 number, 1 special char)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      alert("Password must be at least 8 characters long and include 1 uppercase letter, 1 number, and 1 special character.");
      return;
    }

    // ✅ Username validation (only letters & numbers, 4-20 chars)
    const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
    if (!usernameRegex.test(username)) {
      alert("Username should be 4-20 characters long and contain only letters and numbers.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, userType }),
      });

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        localStorage.setItem("username-ppl", username);

        // ✅ Redirect based on userType (Signup)
        if (userType === "participant") {
          window.location.href = "Participation.html";
        } else if (userType === "organizer") {
          window.location.href = "organizer.html";
        }
      }
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Server error. Please try again.");
    }
  });

  // ✅ Updated Sign-In Logic with Redirection to Different Pages
  document.querySelector(".sign-in-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById("signin-email").value.trim();
    const password = document.getElementById("signin-password").value.trim();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("email-ppl", data.email);
          localStorage.setItem("userType-ppl", data.userType);

          // ✅ Redirect based on userType (Login)
          if (data.userType === "participant") {
            window.location.href = "pg.html"; // Participant Dashboard
          } else if (data.userType === "organizer") {
            window.location.href = "hackathon-dashboard.html"; // Organizer Dashboard
          } else {
            window.location.href = "profile.html"; // Fallback
          }
        } else {
          alert("Invalid credentials!");
        }
      })
      .catch(error => console.error("Error:", error));
  });
});
