// src/services/ActorService.ts
import { Actor } from "../types/types";
import { addActorToFilm, removeActorFromFilm } from "./FilmService";

const baseUrl = "http://localhost:3000/actor";

/**
 * Ruft alle Schauspieler vom Server ab.
 *
 * @returns {Promise<Actor[] | undefined>} Array mit allen Schauspielern oder undefined bei Fehler
 */
export async function getAllActors() {
    console.log("Start GetActors")

    const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    console.log("Got response from server: ", response);
    if (!response.ok) {
        console.error("Error while fetching actors: ", response.status);
        return undefined;
    }

    const tempActors = await response.json();
    return tempActors.data;
}

/**
 * Ruft einen bestimmten Schauspieler anhand seiner ID ab.
 *
 * @param {number} id - Die ID des abzurufenden Schauspielers
 * @returns {Promise<Actor | null>} Der gefundene Schauspieler oder null bei Fehler
 */
export async function getActorById(id: number) {
    console.log("Start GetActorById", id)

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    console.log("Got response from server: ", response);
    if (!response.ok) {
        console.error("Error while fetching actor: ", response.status);
        return null;
    }

    const tempActor = await response.json();
    return tempActor.data;
}

/**
 * Erstellt einen neuen Schauspieler.
 *
 * @param {Actor} actor - Die Daten des zu erstellenden Schauspielers
 * @returns {Promise<void>}
 */
export async function createActor(actor: Actor) {
    console.log("Start CreateActor", actor)

    const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(actor),
    });
    console.log("Got response from server: ", response);
    if (!response.ok) {
        console.error("Error while creating actor: ", response.status);
        throw new Error(`Fehler beim Erstellen des Schauspielers: ${response.statusText}`);
    }
}

/**
 * Aktualisiert einen bestehenden Schauspieler.
 *
 * @param {number} id - Die ID des zu aktualisierenden Schauspielers
 * @param {Actor} actor - Die aktualisierten Schauspielerdaten
 * @returns {Promise<void>}
 */
export async function updateActor(id: number, actor: Actor) {
    console.log("Start UpdateActor", id, actor)

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(actor),
    });
    console.log("Got response from server: ", response);
    if (!response.ok) {
        console.error("Error while updating actor: ", response.status);
        throw new Error(`Fehler beim Aktualisieren des Schauspielers: ${response.statusText}`);
    }
}

/**
 * Löscht einen Schauspieler anhand seiner ID.
 *
 * @param {number} id - Die ID des zu löschenden Schauspielers
 * @returns {Promise<void>}
 */
export async function deleteActor(id: number) {
    console.log("Start DeleteActor", id)

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });
    console.log("Got response from server: ", response);
    if (!response.ok) {
        console.error("Error while deleting actor: ", response.status);
        throw new Error(`Fehler beim Löschen des Schauspielers: ${response.statusText}`);
    }
}

/**
 * Fügt einen Schauspieler zu einem Film hinzu (nutzt den Film-Endpunkt).
 *
 * @param {number} actorId - Die ID des Schauspielers
 * @param {number} filmId - Die ID des Films, zu dem der Schauspieler hinzugefügt werden soll
 * @returns {Promise<void>}
 */
export async function addActorToFilmFromActor(actorId: number, filmId: number) {
    console.log("Start AddActorToFilmFromActor", actorId, filmId)
    await addActorToFilm(filmId, actorId);
}

/**
 * Entfernt einen Schauspieler von einem Film (nutzt den Film-Endpunkt).
 *
 * @param {number} actorId - Die ID des Schauspielers
 * @param {number} filmId - Die ID des Films, von dem der Schauspieler entfernt werden soll
 * @returns {Promise<void>}
 */
export async function removeActorFromFilmFromActor(actorId: number, filmId: number) {
    console.log("Start RemoveActorFromFilmFromActor", actorId, filmId)
    await removeActorFromFilm(filmId, actorId);
}
