import { fetchPosts, createPost, updatePost } from './api.mjs';
import { loginUser, registerUser, logoutUser } from './auth.mjs';

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const registerSection = document.getElementById('register-section');
const loginSection = document.getElementById('login-section');
const feedSection = document.getElementById('feed');
const postsContainer = document.getElementById('posts-container');
const switchToRegisterBtn = document.getElementById('switch-to-register');
const switchToLoginBtn = document.getElementById('switch-to-login');
const logoutBtn = document.getElementById('logout-btn');
const profileUsername = document.getElementById('username');
const profileImage = document.getElementById('profile-image');
const navbar = document.getElementById('navbar');
const postForm = document.getElementById('new-post-form');
const prevBtn = document.getElementById('prev-page-btn');
const nextBtn = document.getElementById('next-page-btn');
const pageIndicator = document.getElementById('page-indicator');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

let currentPage = 1;
const postsPerPage = 5;
let currentSearchQuery = '';
let editingPostId = null;

document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
  updateUserProfile();

  switchToRegisterBtn?.addEventListener('click', () => {
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
  });

  switchToLoginBtn?.addEventListener('click', () => {
    registerSection.style.display = 'none';
    loginSection.style.display = 'block';
  });

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    if (!email || !password) return alert('Vennligst fyll ut alle feltene.');
    const user = await loginUser(email, password);
    if (user) {
      checkLoginStatus();
      updateUserProfile();
    }
  });

  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    if (!username || !email || !password)
      return alert('Vennligst fyll ut alle feltene.');
    const response = await registerUser(username, email, password);
    if (response) {
      alert('Registrering fullført! Du kan nå logge inn.');
      registerSection.style.display = 'none';
      loginSection.style.display = 'block';
    }
  });

  logoutBtn?.addEventListener('click', logoutUser);

  postForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('post-title').value.trim();
    const content = document.getElementById('post-content').value.trim();
    const imageFile = document.getElementById('post-image')?.files[0];
    const imageUrlInput = document
      .getElementById('post-image-url')
      .value.trim();
    if (!title) return alert('Tittel er påkrevd.');

    let imageToSend = '';
    if (imageFile) imageToSend = imageFile;
    else if (imageUrlInput && imageUrlInput.startsWith('http'))
      imageToSend = imageUrlInput;

    if (editingPostId) {
      const updated = await updatePost(editingPostId, {
        title,
        body: content,
        media:
          typeof imageToSend === 'string'
            ? { url: imageToSend, alt: 'Oppdatert bilde' }
            : undefined,
      });
      if (updated) {
        alert('Innlegg oppdatert!');
        editingPostId = null;
        postForm.reset();
        postForm.querySelector("button[type='submit']").textContent =
          'Publiser';
        loadPosts();
      } else alert('Kunne ikke oppdatere innlegget.');
    } else {
      const newPost = await createPost(title, content, imageToSend);
      if (newPost) {
        alert('Innlegg publisert!');
        postForm.reset();
        currentPage = 1;
        loadPosts();
      } else alert('Kunne ikke publisere innlegget.');
    }
  });

  prevBtn?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadPosts();
    }
  });

  nextBtn?.addEventListener('click', () => {
    currentPage++;
    loadPosts();
  });

  searchBtn?.addEventListener('click', () => {
    currentSearchQuery = searchInput.value.trim();
    currentPage = 1;
    loadPosts();
  });
});

function checkLoginStatus() {
  const token = localStorage.getItem('accessToken');
  const apiKey = localStorage.getItem('apiKey');
  const isLoggedIn = token && apiKey;
  document.querySelector('.container').style.display = isLoggedIn
    ? 'none'
    : 'block';
  loginSection.style.display = isLoggedIn ? 'none' : 'block';
  registerSection.style.display = 'none';
  feedSection.style.display = isLoggedIn ? 'block' : 'none';
  navbar.style.display = isLoggedIn ? 'flex' : 'none';
  logoutBtn.style.display = isLoggedIn ? 'block' : 'none';
  if (isLoggedIn) loadPosts();
}

function updateUserProfile() {
  const username = localStorage.getItem('username') || 'Ukjent bruker';
  const avatar = localStorage.getItem('avatarUrl') || 'img/profile.jpg';
  profileUsername.textContent = username;
  profileImage.src = avatar;
}

async function loadPosts() {
  const posts = await fetchPosts(postsPerPage, currentPage);
  const filteredPosts = currentSearchQuery
    ? posts.filter((post) => {
        const title = post.title?.toLowerCase() || '';
        const body = post.body?.toLowerCase() || '';
        const author = post.author?.name?.toLowerCase() || '';
        const query = currentSearchQuery.toLowerCase();
        return (
          title.includes(query) ||
          body.includes(query) ||
          author.includes(query)
        );
      })
    : posts;
  renderPosts(filteredPosts);
}

function renderPosts(posts) {
  pageIndicator.textContent = `Side ${currentPage}`;
  if (!posts || posts.length === 0) {
    postsContainer.innerHTML = '<p>Ingen innlegg funnet.</p>';
    return;
  }

  postsContainer.innerHTML = posts
    .map((post) => {
      const author = post.author?.name || 'Ukjent bruker';
      const avatar = post.author?.avatar?.url || 'img/profile.jpg';
      const title = post.title || 'Uten tittel';
      const body = post.body || '';
      const image = post.media?.url;

      return `
        <div class="post-card">
          <div class="post-header">
            <img class="avatar" src="${avatar}" alt="Profilbilde" />
            <strong>${author}</strong>
          </div>
          <h3>${title}</h3>
          <p>${body}</p>
          ${image ? `<img class="post-img" src="${image}" alt="Innleggsbilde" />` : ''}
          <button class="edit-btn" data-id="${post.id}" data-title="${title}" data-body="${body}">Rediger</button>
        </div>
      `;
    })
    .join('');

  document.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const postId = btn.getAttribute('data-id');
      const title = btn.getAttribute('data-title');
      const body = btn.getAttribute('data-body');
      document.getElementById('post-title').value = title;
      document.getElementById('post-content').value = body;
      editingPostId = postId;
      postForm.querySelector("button[type='submit']").textContent = 'Oppdater';
      window.scrollTo({ top: postForm.offsetTop, behavior: 'smooth' });
    });
  });
}
