const API_BASE_URL = 'https://v2.api.noroff.dev';

// Hardkodet Noroff-token og API-nøkkel for utvikling/testing
const HARDCODED_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic3RlbDI2MDQiLCJlbWFpbCI6ImVsaXN0cjUxMDU3QHN0dWQubm9yb2ZmLm5vIiwiaWF0IjoxNzQ0MjA3NTIzfQ.uOH1ZBOO5WlN9lq3OdmiVFoJ3hPU25v1rtmrFTAfV8g';
const HARDCODED_API_KEY = 'ca269b3b-01c9-4161-8f8e-ca044731af19';

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${HARDCODED_TOKEN}`,
    'X-Noroff-API-Key': HARDCODED_API_KEY,
  };
}

export async function fetchPosts(limit = 10, page = 1) {
  try {
    const validLimit = Number(limit);
    const validPage = Number(page);

    if (isNaN(validLimit) || isNaN(validPage)) {
      alert('Feil: Limit og page må være tall');
      return [];
    }

    const response = await fetch(
      `${API_BASE_URL}/social/posts?_author=true&_comments=true&_reactions=true&limit=${validLimit}&page=${validPage}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.errors?.[0]?.message || 'Kunne ikke hente innlegg.';
      alert(`Feil: ${errorMessage}`);
      return [];
    }

    return data.data || [];
  } catch (error) {
    alert('Uventet feil ved henting av innlegg.');
    return [];
  }
}

async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/social/media`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HARDCODED_TOKEN}`,
        'X-Noroff-API-Key': HARDCODED_API_KEY,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.errors?.[0]?.message || 'Bildeopplasting feilet.';
      alert(`Feil: ${errorMessage}`);
      return null;
    }

    return data.data?.url || null;
  } catch (error) {
    alert('Uventet feil ved bildeopplasting.');
    return null;
  }
}

export async function createPost(title, body = '', image = '') {
  const postData = { title, body };

  try {
    if (image instanceof File && image.type.startsWith('image/')) {
      const uploadedUrl = await uploadImage(image);
      if (uploadedUrl) {
        postData.media = {
          url: uploadedUrl,
          alt: 'Post image',
        };
      }
    }

    if (typeof image === 'string' && image.startsWith('http')) {
      postData.media = {
        url: image,
        alt: 'Post image',
      };
    }

    const response = await fetch(`${API_BASE_URL}/social/posts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(postData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.errors?.[0]?.message || 'Kunne ikke publisere innlegget.';
      alert(`Feil: ${errorMessage}`);
      return null;
    }

    return data.data || null;
  } catch (error) {
    alert('Uventet feil ved oppretting av innlegg.');
    return null;
  }
}

export async function updatePost(postId, updatedData) {
  try {
    const response = await fetch(`${API_BASE_URL}/social/posts/${postId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        data.errors?.[0]?.message || 'Kunne ikke oppdatere innlegget.';
      alert(`Feil: ${message}`);
      return null;
    }

    return data.data || null;
  } catch (error) {
    alert('Uventet feil under oppdatering av innlegg.');
    return null;
  }
}
