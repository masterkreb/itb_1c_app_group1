const baseUrl = "http://localhost:3000/film"; // Basis-URL für Filme

/**
 * Holt alle Filme vom Server.
 *
 * @returns {Promise<Film[]>} Liste von allen Filmen mit Details
 */

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
 *
 * @param {string} id - Die Film-ID
 * @returns {Promise<Film | null>} Der Film oder null wenn nicht gefunden
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
 * Sendet neue Filmdaten an den Server, um einen neuen Film zu erstellen.
 *
 * @param {object} film - Die Filmdaten im JSON-Format
 * @returns {Promise<boolean>} true wenn erfolgreich, sonst false
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
    const errorText = await response.text();
    console.error("DeleteFilm error body:", errorText);


    if (!response.ok) {
        console.error("Fehler beim Löschen vom Film:", response.status);
        return false;
    }

    return true;
}

export async function addActorToFilm(id: number, actorId: number): Promise<boolean> {
    console.log("Start addActorToFilm");

    const response = await fetch(`http://localhost:3000/film/${id}/actor/${actorId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        console.error("Fehler beim Verknüpfen (POST):", response.status);
        return false;
    }

    return true;
}

export async function removeActorFromFilm(id: number, actorId: number): Promise<boolean> {
    console.log("Start removeActorFromFilm");

    const response = await fetch(`http://localhost:3000/film/${id}/actor/${actorId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        console.error("Fehler beim Entfernen (DELETE):", response.status);
        return false;
    }

    return true;
}
