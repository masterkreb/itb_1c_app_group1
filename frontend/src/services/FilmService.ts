// src/services/FilmService.ts
import { Film } from "../types/types";

const baseUrl = "http://localhost:3000/film";

/**
 * Ruft alle Filme vom Server ab.
 *
 * @returns {Promise<Film[] | undefined>} Array mit allen Filmen oder undefined bei Fehler
 */
export async function getAllFilms() {
    console.log("Start GetFilms")

    const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    console.log("Got response from server: ", response);
    if (!response.ok) {
        console.error("Error while fetching films: ", response.status);
        return undefined;
    }

    const tempFilms = await response.json();
    return tempFilms.data;
}

/**
 * Ruft einen bestimmten Film anhand seiner ID ab.
 *
 * @param {number} id - Die ID des abzurufenden Films
 * @returns {Promise<Film | null>} Der gefundene Film oder null bei Fehler
 */
export async function getFilmById(id: number) {
    console.log("Start GetFilmById", id)

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    console.log("Got response from server: ", response);
    if (!response.ok) {
        console.error("Error while fetching film: ", response.status);
        return null;
    }

    const tempFilm = await response.json();
    return tempFilm.data;
}

/**
 * Erstellt einen neuen Film.
 *
 * @param {Film} film - Die Daten des zu erstellenden Films
 * @returns {Promise<void>}
 */
export async function createFilm(film: Film) {
    console.log("Start CreateFilm", film)

    const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(film),
    });
    console.log("Got response from server: ", response);
    if (!response.ok) {
        console.error("Error while creating film: ", response.status);
        throw new Error(`Fehler beim Erstellen des Films: ${response.statusText}`);
    }
}

/**
 * Aktualisiert einen bestehenden Film.
 *
 * @param {number} id - Die ID des zu aktualisierenden Films
 * @param {Film} film - Die aktualisierten Filmdaten
 * @returns {Promise<void>}
 */
export async function updateFilm(id: number, film: Film) {
    console.log("Start UpdateFilm", id, film)

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(film),
    });
    console.log("Got response from server: ", response);
    if (!response.ok) {
        console.error("Error while updating film: ", response.status);
        throw new Error(`Fehler beim Aktualisieren des Films: ${response.statusText}`);
    }
}

/**
 * Löscht einen Film anhand seiner ID.
 *
 * @param {number} id - Die ID des zu löschenden Films
 * @returns {Promise<void>}
 */
export async function deleteFilm(id: number) {
    console.log("Start DeleteFilm", id)

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });
    console.log("Got response from server: ", response);
    if (!response.ok) {
        console.error("Error while deleting film: ", response.status);
        throw new Error(`Fehler beim Löschen des Films: ${response.statusText}`);
    }
}

/**
 * Fügt einen Schauspieler zu einem Film hinzu.
 *
 * @param {number} filmId - Die ID des Films
 * @param {number} actorId - Die ID des Schauspielers, der hinzugefügt werden soll
 * @returns {Promise<void>}
 */
export async function addActorToFilm(filmId: number, actorId: number) {
    console.log("Start AddActorToFilm", filmId, actorId)

    const response = await fetch(`${baseUrl}/${filmId}/actor/${actorId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    });
    console.log("Got response from server: ", response);
    if (!response.ok) {
        console.error("Error while adding actor to film: ", response.status);
        throw new Error(`Fehler beim Hinzufügen des Schauspielers zum Film: ${response.statusText}`);
    }
}

/**
 * Entfernt einen Schauspieler von einem Film.
 *
 * @param {number} filmId - Die ID des Films
 * @param {number} actorId - Die ID des Schauspielers, der entfernt werden soll
 * @returns {Promise<void>}
 */
export async function removeActorFromFilm(filmId: number, actorId: number) {
    console.log("Start RemoveActorFromFilm", filmId, actorId)

    const response = await fetch(`${baseUrl}/${filmId}/actor/${actorId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });
    console.log("Got response from server: ", response);
    if (!response.ok) {
        console.error("Error while removing actor from film: ", response.status);
        throw new Error(`Fehler beim Entfernen des Schauspielers vom Film: ${response.statusText}`);
    }
}
