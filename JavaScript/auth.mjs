const API_BASE_URL = 'https://v2.api.noroff.dev';

// Hardkodet token og API-nøkkel for utviklingsformål
const HARDCODED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const HARDCODED_API_KEY = 'ca269b3b-01c9-4161-8f8e-ca044731af19';

/**
 * Registrerer en ny bruker via Noroff API
 * @param {string} username - Brukernavn (må være gyldig)
 * @param {string} email - Gyldig Noroff-e-post (f.eks. brukernavn@stud.noroff.no)
 * @param {string} password - Passord med minst 8 tegn
 * @returns {Promise<Object|null>} Brukerdata ved suksess eller null ved feil
 */
export async function registerUser(username, email, password) {
  const isNoroffEmail = /@(stud\.)?noroff\.no$/.test(email);

  if (!isNoroffEmail) {
    alert('Du må bruke en @noroff.no eller @stud.noroff.no e-post.');
    return null;
  }

  try {
    const requestBody = {
      name: username,
      email,
      password,
      bio: 'Dette er min profilbio',
      avatar: {
        url: 'https://img.service.com/avatar.jpg',
        alt: 'Min avatar',
      },
      banner: {
        url: 'https://img.service.com/banner.jpg',
        alt: 'Min bannertekst',
      },
      venueManager: true,
    };

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data.errors?.[0]?.message || 'Ukjent feil.';
      alert(
        `Registrering feilet. Feilkode: ${response.status}. Melding: ${message}`
      );
      return null;
    }

    alert('Registrering vellykket! Du kan nå logge inn.');
    return data;
  } catch (error) {
    alert('Uventet feil under registrering.');
    return null;
  }
}

/**
 * Logger inn brukeren og lagrer nødvendige verdier i localStorage
 * @param {string} email - Brukerens e-post
 * @param {string} password - Brukerens passord
 * @returns {Promise<Object|null>} Brukerdata eller null ved feil
 */
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.data?.accessToken) {
      const message =
        data.errors?.[0]?.message ||
        'Innlogging feilet. Sjekk brukernavn og passord.';
      alert(`Innlogging feilet: ${message}`);
      return null;
    }

    localStorage.setItem('accessToken', HARDCODED_TOKEN);
    localStorage.setItem('apiKey', HARDCODED_API_KEY);
    localStorage.setItem('username', data.data.name);
    localStorage.setItem(
      'avatarUrl',
      data.data.avatar?.url || 'img/profile.jpg'
    );

    alert('Innlogging vellykket!');
    return data;
  } catch (error) {
    alert('Innlogging feilet. Prøv igjen senere.');
    return null;
  }
}

/**
 * Logger ut brukeren og fjerner all brukerdata fra localStorage
 */
export function logoutUser() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('apiKey');
  localStorage.removeItem('username');
  localStorage.removeItem('avatarUrl');

  alert('Du er nå logget ut!');
  window.location.reload();
}
