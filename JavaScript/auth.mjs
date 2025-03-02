const API_BASE_URL = "https://v2.api.noroff.dev";

// **Registrer bruker**
export async function registerUser(username, email, password) {
    try {
        const requestBody = {
            name: username,
            email,
            password,
            bio: "Dette er min profilbio",
            avatar: { url: "", alt: "Brukerens avatar" }
        };

        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error("Registrering feilet.");
        }

        console.log("Registrering vellykket!");
        alert("Registrering vellykket! Du kan nå logge inn.");
        return await response.json();
    } catch (error) {
        console.error("Feil ved registrering:", error);
    }
}

// **Logg inn bruker**
export async function loginUser(email, password) {
    try {
        console.log("Starter innlogging for:", email);

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log("API-respons ved innlogging:", data);

        if (!response.ok) {
            alert("Innlogging feilet. Sjekk brukernavn og passord.");
            return;
        }

        if (!data.data || !data.data.accessToken) {
            console.error("API-et returnerte ikke et gyldig token.");
            alert("Innlogging feilet. Prøv igjen.");
            return;
        }

        console.log("Innlogging vellykket! Token mottatt:", data.data.accessToken);

        // **Hente API-nøkkel**
        const apiKey = await fetchApiKey(data.data.accessToken);
        if (!apiKey) {
            alert("Innlogging vellykket, men API-nøkkel mangler. Prøv å generere en manuelt.");
            return;
        }

        console.log("API-nøkkel mottatt:", apiKey);

        let avatarUrl = data.data.avatar?.url || "img/profile.jpg";

        // **Lagre API-nøkkel, token og brukerinformasjon i localStorage**
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("apiKey", apiKey);
        localStorage.setItem("username", data.data.name);
        localStorage.setItem("avatarUrl", avatarUrl);

        console.log("Lagring fullført:", {
            token: localStorage.getItem("accessToken"),
            apiKey: localStorage.getItem("apiKey"),
            username: localStorage.getItem("username"),
            avatar: localStorage.getItem("avatarUrl")
        });

        alert("Innlogging vellykket!");
        return data;
    } catch (error) {
        console.error("Feil ved innlogging:", error);
        alert("Innlogging feilet. Prøv igjen senere.");
    }
}

// **Hente API-nøkkel**
async function fetchApiKey(token) {
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

        return data.data.key;
    } catch (error) {
        console.error("Feil ved henting av API-nøkkel:", error);
        return null;
    }
}

// **Logg ut bruker**
export function logoutUser() {
    console.log("Brukeren logger ut...");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("apiKey");
    localStorage.removeItem("username");
    localStorage.removeItem("avatarUrl");

    alert("Du er nå logget ut!");
    window.location.reload();
}
