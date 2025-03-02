import { fetchPosts, createPost } from "./api.mjs";
import { loginUser, registerUser, logoutUser } from "./auth.mjs";

// **DOM ELEMENTER**
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const registerSection = document.getElementById("register-section");
const loginSection = document.getElementById("login-section");
const feedSection = document.getElementById("feed") || null;
const postsContainer = document.getElementById("posts-container") || null;
const switchToRegisterBtn = document.getElementById("switch-to-register");
const switchToLoginBtn = document.getElementById("switch-to-login");
const logoutBtn = document.getElementById("logout-btn");
const profileUsername = document.getElementById("username");
const profileImage = document.getElementById("profile-image");
const navbar = document.getElementById("navbar");

document.addEventListener("DOMContentLoaded", () => {
    checkLoginStatus();
    updateUserProfile();

    if (switchToRegisterBtn) {
        switchToRegisterBtn.addEventListener("click", () => {
            loginSection.style.display = "none";
            registerSection.style.display = "block";
        });
    }

    if (switchToLoginBtn) {
        switchToLoginBtn.addEventListener("click", () => {
            registerSection.style.display = "none";
            loginSection.style.display = "block";
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            console.log("Logg inn-knapp trykket.");
            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();

            if (!email || !password) {
                alert("Vennligst fyll ut alle feltene.");
                return;
            }

            await loginUser(email, password);
            checkLoginStatus();
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            console.log("Registreringsskjema sendt.");
            const username = document.getElementById("register-name").value.trim();
            const email = document.getElementById("register-email").value.trim();
            const password = document.getElementById("register-password").value.trim();

            if (!username || !email || !password) {
                console.warn("Alle felt må fylles ut.");
                alert("Vennligst fyll ut alle feltene.");
                return;
            }

            try {
                console.log("Kaller registerUser() med:", { username, email, password });
                const response = await registerUser(username, email, password);
                console.log("Serverrespons etter registrering:", response);

                if (response) {
                    alert("Registrering fullført! Du kan nå logge inn.");
                    window.location.reload();
                }
            } catch (error) {
                console.error("Feil under registrering:", error);
                alert("Noe gikk galt under registrering. Prøv igjen.");
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            logoutUser();
            localStorage.removeItem("avatarUrl");
            localStorage.removeItem("apiKey");
        });
    }
});

function checkLoginStatus() {
    const token = localStorage.getItem("accessToken");
    const apiKey = localStorage.getItem("apiKey");

    if (token && apiKey) {
        registerSection.style.display = "none";
        loginSection.style.display = "none";
        feedSection.style.display = "block";

        if (navbar) navbar.style.display = "flex";
        if (logoutBtn) logoutBtn.style.display = "block";

        console.log("Gyldig token og API-nøkkel funnet, laster inn innlegg...");
        loadPosts();
    } else {
        console.warn("Ingen gyldig token eller API-nøkkel funnet. Brukeren må logge inn.");
        registerSection.style.display = "none";
        feedSection.style.display = "none";
        loginSection.style.display = "block";

        if (navbar) navbar.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "none";
    }
}

function updateUserProfile() {
    profileUsername.textContent = localStorage.getItem("username") || "Ukjent bruker";
    let savedAvatar = localStorage.getItem("avatarUrl");

    if (!savedAvatar || savedAvatar.includes("unsplash.com") || savedAvatar === "null") {
        savedAvatar = "img/profile.jpg";
        localStorage.setItem("avatarUrl", savedAvatar);
    }

    profileImage.src = savedAvatar;
}

async function loadPosts() {
    const token = localStorage.getItem("accessToken");
    const apiKey = localStorage.getItem("apiKey");

    if (!token || !apiKey) {
        console.warn("Ingen gyldig token eller API-nøkkel funnet. Hopper over lasting av innlegg.");
        return;
    }

    try {
        const posts = await fetchPosts();

        if (!posts || posts.length === 0) {
            postsContainer.innerHTML = "<p>Ingen innlegg funnet.</p>";
        } else {
            postsContainer.innerHTML = posts.map(post => `<h3>${post.title}</h3>`).join("");
        }
    } catch (error) {
        console.error("Feil ved lasting av innlegg:", error);
        postsContainer.innerHTML = "<p>Kunne ikke laste inn innlegg.</p>";
    }
}