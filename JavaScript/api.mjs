const API_BASE_URL = "https://v2.api.noroff.dev";

// Hardkodet Noroff-token og API-nøkkel for utvikling/testing
const HARDCODED_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic3RlbDI2MDQiLCJlbWFpbCI6ImVsaXN0cjUxMDU3QHN0dWQubm9yb2ZmLm5vIiwiaWF0IjoxNzQ0MjA3NTIzfQ.uOH1ZBOO5WlN9lq3OdmiVFoJ3hPU25v1rtmrFTAfV8g";
const HARDCODED_API_KEY = "ca269b3b-01c9-4161-8f8e-ca044731af19";

/**
 * Henter HTTP headers med autentisering og API-nøkkel
 * @returns {Object} Headers for alle forespørsler
 */
function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${HARDCODED_TOKEN}`,
    "X-Noroff-API-Key": HARDCODED_API_KEY,
  };
}

/**
 * Henter alle innlegg fra Noroff API, inkludert forfatter, kommentarer og reaksjoner
 * @returns {Promise<Array>} Liste med innlegg eller tom liste ved feil
 */
export async function fetchPosts() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/social/posts?_author=true&_comments=true&_reactions=true`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      // console.error("Feil ved henting av innlegg:", response.status);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    // console.error("Uventet feil:", error);
    return [];
  }
}

/**
 * Oppretter et nytt innlegg med valgfritt bilde
 * @param {string} title - Tittel på innlegget (påkrevd)
 * @param {string} body - Tekstinnhold (valgfritt)
 * @param {string} imageUrl - URL til bilde (valgfritt, må starte med http)
 * @returns {Promise<Object|null>} Det publiserte innlegget eller null ved feil
 */
export async function createPost(title, body = "", imageUrl = "") {
  const postData = { title, body };

  if (imageUrl && imageUrl.startsWith("http")) {
    postData.media = {
      url: imageUrl,
      alt: "Post image",
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/social/posts`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      // const error = await response.json();
      // console.error("Feil ved oppretting av post:", error);
      throw new Error("Kunne ikke publisere innlegget.");
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    // console.error("Uventet feil ved posting:", error);
    return null;
  }
}

