import { fetchPosts, createPost } from "./api.mjs";
import { loginUser, registerUser, logoutUser } from "./auth.mjs";

// DOM ELEMENTER
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const registerSection = document.getElementById("register-section");
const loginSection = document.getElementById("login-section");
const feedSection = document.getElementById("feed");
const postsContainer = document.getElementById("posts-container");
const switchToRegisterBtn = document.getElementById("switch-to-register");
const switchToLoginBtn = document.getElementById("switch-to-login");
const logoutBtn = document.getElementById("logout-btn");
const profileUsername = document.getElementById("username");
const profileImage = document.getElementById("profile-image");
const navbar = document.getElementById("navbar");
const postForm = document.getElementById("new-post-form");

/**
 * Initialiserer appen når siden er lastet
 */
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  updateUserProfile();

  switchToRegisterBtn?.addEventListener("click", () => {
    loginSection.style.display = "none";
    registerSection.style.display = "block";
  });

  switchToLoginBtn?.addEventListener("click", () => {
    registerSection.style.display = "none";
    loginSection.style.display = "block";
  });

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!email || !password) {
      alert("Vennligst fyll ut alle feltene.");
      return;
    }

    const user = await loginUser(email, password);
    if (user) {
      checkLoginStatus();
      updateUserProfile();
    }
  });

  registerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    if (!username || !email || !password) {
      alert("Vennligst fyll ut alle feltene.");
      return;
    }

    const response = await registerUser(username, email, password);
    if (response) {
      alert("Registrering fullført! Du kan nå logge inn.");
      registerSection.style.display = "none";
      loginSection.style.display = "block";
    }
  });

  logoutBtn?.addEventListener("click", () => {
    logoutUser();
  });

  postForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("post-title").value.trim();
    const content = document.getElementById("post-content").value.trim();
    const imageFile = document.getElementById("post-image").files[0];

    let imageUrl = "";
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile);
    }

    if (!title) {
      alert("Tittel er påkrevd.");
      return;
    }

    const newPost = await createPost(title, content, imageUrl);
    if (newPost) {
      alert("Innlegg publisert!");
      postForm.reset();
      loadPosts();
    } else {
      alert("Kunne ikke publisere innlegget.");
    }
  });
});

/**
 * Sjekker om bruker er logget inn og oppdaterer UI
 */
function checkLoginStatus() {
  const token = localStorage.getItem("accessToken");
  const apiKey = localStorage.getItem("apiKey");
  const isLoggedIn = token && apiKey;

  const container = document.querySelector(".container");
  if (container) {
    container.style.display = isLoggedIn ? "none" : "block";
  }

  loginSection.style.display = isLoggedIn ? "none" : "block";
  registerSection.style.display = "none";
  feedSection.style.display = isLoggedIn ? "block" : "none";
  navbar.style.display = isLoggedIn ? "flex" : "none";
  logoutBtn.style.display = isLoggedIn ? "block" : "none";

  if (isLoggedIn) {
    loadPosts();
  }
}

/**
 * Oppdaterer brukerens profilbilde og navn i toppfeltet
 */
function updateUserProfile() {
  const username = localStorage.getItem("username") || "Ukjent bruker";
  const avatar = localStorage.getItem("avatarUrl") || "img/profile.jpg";

  profileUsername.textContent = username;
  profileImage.src = avatar;
}

/**
 * Laster innlegg og viser dem i UI
 */
async function loadPosts() {
  const posts = await fetchPosts();

  if (!posts || posts.length === 0) {
    postsContainer.innerHTML = "<p>Ingen innlegg funnet.</p>";
    return;
  }

  postsContainer.innerHTML = posts
    .map((post) => {
      const author = post.author?.name || "Ukjent bruker";
      const avatar = post.author?.avatar?.url || "img/profile.jpg";
      const title = post.title || "Uten tittel";
      const body = post.body || "";
      const image = post.media?.url;

      return `
        <div class="post-card">
          <div class="post-header">
            <img class="avatar" src="${avatar}" alt="Profilbilde" />
            <strong>${author}</strong>
          </div>
          <h3>${title}</h3>
          <p>${body}</p>
          ${image ? `<img class="post-img" src="${image}" alt="Innleggsbilde" />` : ""}
        </div>
      `;
    })
    .join("");
}
