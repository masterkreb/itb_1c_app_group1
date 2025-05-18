const baseUrl = "http://localhost:3000/film"; // Basis-URL für Filme

export async function getAllFilms() {
    console.log("Start GetAllFilms");

    const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    console.log("Got response from server:", response);

    if (!response.ok) {
        console.error("Fehler beim Holen der Filme:", response.status);
        return undefined;
    }

    const tempFilms = await response.json();
    return tempFilms.data;
}

/**
 * Holt einen bestimmten Film anhand der ID.
 * @param id
 * @returns
 */
export async function getFilmById(id: string) {
    console.log("Start GetFilmById");

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    console.log("Got response from server:", response);

    if (!response.ok) {
        console.error("Fehler beim Holen vom Film:", response.status);
        return undefined;
    }

    const tempFilm = await response.json();
    return tempFilm.data;
}

/**
 * Erstellt einen neuen Film.
 */
export async function createFilm(film: object) {
    console.log("Start CreateFilm");

    const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(film),
    });

    console.log("CreateFilm response:", response);

    if (!response.ok) {
        console.error("Fehler beim Erstellen vom Film:", response.status);
        return false;
    }

    return true;
}

/**
 * Aktualisiert einen bestehenden Film anhand der ID.
 */
export async function updateFilm(id: string, film: object) {
    console.log("Start UpdateFilm");

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(film),
    });

    console.log("UpdateFilm response:", response);

    if (!response.ok) {
        console.error("Fehler beim Aktualisieren vom Film:", response.status);
        return false;
    }

    return true;
}

/**
 * Löscht einen Film anhand der ID.
 */
export async function deleteFilm(id: string) {
    console.log("Start DeleteFilm");

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    console.log("DeleteFilm response:", response);

    if (!response.ok) {
        console.error("Fehler beim Löschen vom Film:", response.status);
        return false;
    }

    return true;
}
