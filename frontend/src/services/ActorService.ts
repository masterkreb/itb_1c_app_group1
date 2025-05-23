// src/services/ActorService.ts
import { Actor } from "../types/types";
import { addActorToFilm, removeActorFromFilm } from "./FilmService";

const baseUrl = "http://localhost:3000/actor";

/**
 * Ruft alle Schauspieler vom Server ab.
 * 
 * @example
 * // Beispiel: Alle Schauspieler abrufen und in einer Liste anzeigen
 * const actors = await getAllActors();
 * if (actors.length > 0) {
 *   // Schauspieler in UI anzeigen
 * }
 * 
 * @returns {Promise<Actor[]>} Array mit allen Schauspielern
 * @throws {Error} Bei Netzwerkfehlern oder Server-Fehlern
 */
export async function getAllActors(): Promise<Actor[]> {
    const response = await fetch(baseUrl);
    if (!response.ok) {
        throw new Error(`Fehler beim Laden der Schauspieler: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.data as Actor[];
}

/**
 * Ruft einen bestimmten Schauspieler anhand seiner ID ab.
 *
 * @example
 * // Beispiel: Schauspieler mit ID 1 abrufen und Details anzeigen
 * const actor = await getActorById(1);
 * if (actor) {
 *   // Schauspieler-Details anzeigen
 * } else {
 *   // Fehlermeldung anzeigen
 * }
 *
 * @param {number} id - Die ID des abzurufenden Schauspielers
 * @returns {Promise<Actor | null>} Der gefundene Schauspieler oder null bei Fehler
 */
export async function getActorById(id: number): Promise<Actor | null> {
    try {
        const response = await fetch(`${baseUrl}/${id}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`Fehler beim Laden des Schauspielers (${response.status}):`, errorData);
            throw new Error(`Schauspieler nicht gefunden: ${errorData.message || response.statusText}`);
        }
        const data = await response.json();
        return data.data as Actor;
    } catch (error) {
        console.error("Fehler in getActorById:", error);
        return null;
    }
}

/**
 * Erstellt einen neuen Schauspieler.
 * 
 * @example
 * // Beispiel: Neuen Schauspieler erstellen
 * const newActor = {
 *   first_name: "John",
 *   last_name: "Doe"
 * };
 * await createActor(newActor);
 * 
 * @param {Actor} actor - Die Daten des zu erstellenden Schauspielers
 * @returns {Promise<void>}
 * @throws {Error} Bei Netzwerkfehlern oder ungültigen Daten
 */
export async function createActor(actor: Actor): Promise<void> {
    const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actor),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Fehler beim Erstellen des Schauspielers: ${errorData.message || response.statusText}`);
    }
}

/**
 * Aktualisiert einen bestehenden Schauspieler.
 * 
 * @example
 * // Beispiel: Schauspieler mit ID 1 aktualisieren
 * const updatedActor = {
 *   first_name: "Max",
 *   last_name: "Mustermann"
 * };
 * await updateActor(1, updatedActor);
 * 
 * @param {number} id - Die ID des zu aktualisierenden Schauspielers
 * @param {Actor} actor - Die aktualisierten Schauspielerdaten
 * @returns {Promise<void>}
 * @throws {Error} Bei Netzwerkfehlern oder ungültigen Daten
 */
export async function updateActor(id: number, actor: Actor): Promise<void> {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actor),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Fehler beim Aktualisieren des Schauspielers: ${errorData.message || response.statusText}`);
    }
}

/**
 * Löscht einen Schauspieler anhand seiner ID.
 * 
 * @example
 * // Beispiel: Schauspieler mit ID 1 löschen
 * await deleteActor(1);
 * 
 * @param {number} id - Die ID des zu löschenden Schauspielers
 * @returns {Promise<void>}
 * @throws {Error} Bei Netzwerkfehlern oder wenn der Schauspieler nicht existiert
 */
export async function deleteActor(id: number): Promise<void> {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Fehler beim Löschen des Schauspielers: ${errorData.message || response.statusText}`);
    }
}

/**
 * Fügt einen Schauspieler zu einem Film hinzu (nutzt den Film-Endpunkt).
 * 
 * @example
 * // Beispiel: Schauspieler mit ID 1 zum Film mit ID 5 hinzufügen
 * await addActorToFilmFromActor(1, 5);
 * 
 * @param {number} actorId - Die ID des Schauspielers
 * @param {number} filmId - Die ID des Films, zu dem der Schauspieler hinzugefügt werden soll
 * @returns {Promise<void>}
 * @throws {Error} Bei Netzwerkfehlern oder wenn Film oder Schauspieler nicht existieren
 */
export async function addActorToFilmFromActor(actorId: number, filmId: number): Promise<void> {
    await addActorToFilm(filmId, actorId);
}

/**
 * Entfernt einen Schauspieler von einem Film (nutzt den Film-Endpunkt).
 * 
 * @example
 * // Beispiel: Schauspieler mit ID 1 vom Film mit ID 5 entfernen
 * await removeActorFromFilmFromActor(1, 5);
 * 
 * @param {number} actorId - Die ID des Schauspielers
 * @param {number} filmId - Die ID des Films, von dem der Schauspieler entfernt werden soll
 * @returns {Promise<void>}
 * @throws {Error} Bei Netzwerkfehlern oder wenn die Verknüpfung nicht existiert
 */
export async function removeActorFromFilmFromActor(actorId: number, filmId: number): Promise<void> {
    await removeActorFromFilm(filmId, actorId);
}

