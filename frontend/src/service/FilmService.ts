import type { Film } from "../types/types"

const baseUrl = "http://localhost:3000/film"

/**
 * Service für die Verwaltung von Filmen
 * Stellt CRUD-Operationen für Film-Entitäten bereit
 */

/**
 * Ruft alle Filme ab
 * @returns {Promise<Film[]>} Promise mit Array aller Filme
 * @throws {Error} Wenn das Abrufen fehlschlägt
 * @example
 * const films = await getAllFilms();
 */
export async function getAllFilms(): Promise<Film[]> {
    console.log("Start GetFilms")

    const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    console.log("Got response from server: ", response)
    if (!response.ok) {
        console.error("Error while fetching films: ", response.status)
        throw new Error(`Fehler beim Abrufen der Filme: ${response.status}`)
    }

    const tempFilms = await response.json()
    return tempFilms.data
}

/**
 * Ruft einen einzelnen Film nach ID ab
 * @param {number} id - Die ID des Films
 * @returns {Promise<Film>} Promise mit dem Film-Objekt
 * @throws {Error} Wenn der Film nicht gefunden wird
 * @example
 * const film = await getFilmById(1);
 */
export async function getFilmById(id: number): Promise<Film> {
    console.log("Start GetFilmById")
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    console.log("Got response from server: ", response)

    if (!response.ok) {
        throw new Error(`Fehler beim Laden des Films: ${response.status}`)
    }

    const result = await response.json()
    return result.data
}



export async function createFilm(filmData: Partial<Film>) {
    const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filmData)
    });

    if (!response.ok) {
        throw new Error(`Fehler beim Erstellen des Films: ${response.status}`);
    }

    return response.json();
}

/**
 * Aktualisiert einen bestehenden Film
 * @param {number} id - Die ID des zu aktualisierenden Films
 * @param {Partial<Film>} film - Zu aktualisierende Film-Daten
 * @returns {Promise<Film>} Promise mit dem aktualisierten Film
 * @throws {Error} Wenn das Aktualisieren fehlschlägt
 * @example
 * const updatedFilm = await updateFilm(1, { title: "Updated Title" });
 */
export async function updateFilm(id: number, film: Partial<Film>): Promise<Film> {
    console.log("Start UpdateFilm")
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(film),
    })

    console.log("Got response from server: ", response)

    if (!response.ok) {
        throw new Error(`Fehler beim Aktualisieren des Films: ${response.status}`)
    }

    const result = await response.json()
    return result.data
}

/**
 * Löscht einen Film
 * @param {number} id - Die ID des zu löschenden Films
 * @returns {Promise<boolean>} Promise die bei Erfolg true zurückgibt
 * @throws {Error} Wenn das Löschen fehlschlägt
 * @example
 * await deleteFilm(1);
 */
export async function deleteFilm(id: number): Promise<boolean> {
    console.log("Start DeleteFilm")
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })

    console.log("Got response from server: ", response)

    if (!response.ok) {
        console.error("Error while deleting film: ", response.status)
        return false
    }

    return true
}

/**
 * Fügt einen Schauspieler zu einem Film hinzu über Film Endpoint
 * WICHTIG: Verwendet ausschließlich den Film Endpoint wie gefordert
 * @param {number} filmId - Die ID des Films
 * @param {number} actorId - Die ID des Schauspielers
 * @returns {Promise<boolean>} Promise die bei Erfolg true zurückgibt
 * @throws {Error} Wenn die Verknüpfung fehlschlägt
 * @example
 * await addActorToFilm(1, 5); // Fügt Schauspieler 5 zu Film 1 hinzu
 */
export async function addActorToFilm(filmId: number, actorId: number): Promise<boolean> {
    console.log(`Start AddActorToFilm - Actor ${actorId} zu Film ${filmId}`)

    const response = await fetch(`${baseUrl}/${filmId}/actor/${actorId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })

    console.log("Got response from server: ", response)

    if (!response.ok) {
        console.error("Error while adding actor to film: ", response.status)
        return false
    }

    return true
}

/**
 * Entfernt einen Schauspieler von einem Film über Film Endpoint
 * WICHTIG: Verwendet ausschließlich den Film Endpoint wie gefordert
 * @param {number} filmId - Die ID des Films
 * @param {number} actorId - Die ID des Schauspielers
 * @returns {Promise<boolean>} Promise die bei Erfolg true zurückgibt
 * @throws {Error} Wenn das Entfernen fehlschlägt
 * @example
 * await removeActorFromFilm(1, 5); // Entfernt Schauspieler 5 von Film 1
 */
export async function removeActorFromFilm(filmId: number, actorId: number): Promise<boolean> {
    console.log(`Start RemoveActorFromFilm - Actor ${actorId} von Film ${filmId}`)

    const response = await fetch(`${baseUrl}/${filmId}/actor/${actorId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })

    console.log("Got response from server: ", response)

    if (!response.ok) {
        console.error("Error while removing actor from film: ", response.status)
        return false
    }

    return true
}
