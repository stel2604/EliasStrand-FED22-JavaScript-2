const API_BASE_URL = "https://v2.api.noroff.dev";

// **Hjelpefunksjon for å lage riktige headers med API-nøkkel og token**
async function getHeaders() {
    const token = localStorage.getItem("accessToken");
    let apiKey = localStorage.getItem("apiKey");

    if (!token) {
        console.warn("❌ Ingen token funnet. API-kall vil ikke fungere.");
        return null;
    }

    if (!apiKey) {
        console.warn("⚠️ Ingen API-nøkkel funnet. Forsøker å hente en ny...");
        apiKey = await fetchApiKey(); // Hent API-nøkkel hvis den ikke finnes

        if (!apiKey) {
            console.error("🚨 Klarte ikke hente API-nøkkel. API-kall vil mislykkes.");
            return null;
        }
    }

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey
    };
}

// **Hente API-nøkkel hvis den mangler**
export async function fetchApiKey() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        console.error("Kan ikke hente API-nøkkel uten gyldig token.");
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/create-api-key`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok || !data.data || !data.data.key) {
            console.error("Kunne ikke hente API-nøkkel:", data);
            return null;
        }

        console.log("✅ API-nøkkel hentet:", data.data.key);
        localStorage.setItem("apiKey", data.data.key);
        return data.data.key;
    } catch (error) {
        console.error("❌ Feil ved henting av API-nøkkel:", error);
        return null;
    }
}

// **Hente innlegg**
export async function fetchPosts() {
    const headers = await getHeaders();
    if (!headers) {
        alert("API-nøkkel eller token mangler. Logg ut og inn igjen.");
        return [];
    }

    console.log("Henter innlegg med følgende headers:", headers);

    try {
        const response = await fetch(`${API_BASE_URL}/social/posts`, {
            method: "GET",
            headers: headers
        });

        if (response.status === 401) {
            console.error("Ugyldig token eller ikke autorisert tilgang.");
            alert("Din økt har utløpt eller er ugyldig. Logg ut og inn igjen.");
            localStorage.removeItem("accessToken");
            return [];
        }

        if (!response.ok) {
            throw new Error(`Feil ved henting av innlegg: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Feil ved henting av innlegg:", error);
        return [];
    }
}

// **Publisere et nytt innlegg**
export async function createPost(title, content) {
    const headers = await getHeaders();
    if (!headers) {
        alert("API-nøkkel eller token mangler. Logg ut og inn igjen.");
        return;
    }

    console.log("Publiserer innlegg med følgende headers:", headers);

    try {
        const response = await fetch(`${API_BASE_URL}/social/posts`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ title, content })
        });

        if (response.status === 401) {
            console.error("Ugyldig token eller ikke autorisert tilgang.");
            alert("Din økt har utløpt. Logg ut og inn igjen.");
            localStorage.removeItem("accessToken");
            return;
        }

        if (!response.ok) {
            throw new Error("Kunne ikke publisere innlegget.");
        }

        return await response.json();
    } catch (error) {
        console.error("Feil ved publisering av innlegg:", error);
    }
}
