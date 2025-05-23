// src/service/ActorService.ts

import { Actor, ActorInput } from "../types/types";

const baseUrl = "http://localhost:3000/actor";

/**
 * Ruft alle Schauspieler ab (GET /actor).
 *
 * @example
 * const actors = await getAllActors();
 * if (actors) {
 *   console.log(`${actors.length} Schauspieler gefunden`);
 * }
 *
 * @returns {Promise<Actor[] | undefined>} Array von Actor-Objekten oder undefined bei einem Fehler
 * @throws Keine Exceptions, gibt undefined zurück bei Fehlern
 */
export async function getAllActors(): Promise<Actor[] | undefined> {
    try {
        const response = await fetch(baseUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Fehler beim Abrufen der Schauspieler:", response.status);
            return undefined;
        }

        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error("Fehler beim Abrufen der Schauspieler:", error);
        return undefined;
    }
}

/**
 * Ruft einen einzelnen Schauspieler per ID ab (GET /actor/{id}).
 *
 * @example
 * try {
 *   const actor = await getActorById(5);
 *   console.log(`Schauspieler gefunden: ${actor.first_name} ${actor.last_name}`);
 * } catch (error) {
 *   console.error("Fehler beim Abrufen des Schauspielers:", error);
 * }
 *
 * @param {number} id Schauspieler-ID
 * @returns {Promise<Actor>} Das einzelne Actor-Objekt
 * @throws {Error} Wenn der Schauspieler nicht gefunden wird oder ein Fehler auftritt
 */
export async function getActorById(id: number): Promise<Actor> {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Schauspieler mit ID ${id} nicht gefunden (Status ${response.status})`);
    }

    const json = await response.json();
    return json.data;
}

/**
 * Legt einen neuen Schauspieler an (POST /actor).
 *
 * @example
 * try {
 *   const newActor = await createActor({
 *     first_name: "Tom",
 *     last_name: "Hanks"
 *   });
 *   console.log(`Neuer Schauspieler angelegt mit ID: ${newActor.actor_id}`);
 * } catch (error) {
 *   console.error("Fehler beim Anlegen des Schauspielers:", error);
 * }
 *
 * @param {ActorInput} payload Daten für den neuen Schauspieler (ohne actor_id)
 * @returns {Promise<Actor>} Das neu angelegte Actor-Objekt (mit actor_id)
 * @throws {Error} Wenn das Anlegen fehlschlägt
 */
export async function createActor(payload: ActorInput): Promise<Actor> {
    const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`createActor fehlgeschlagen: ${response.status}`);
    }

    const json = await response.json();
    return json.data;
}

/**
 * Aktualisiert einen bestehenden Schauspieler per ID (PUT /actor/{id}).
 *
 * @example
 * try {
 *   const updatedActor = await updateActor(5, {
 *     first_name: "Thomas",
 *     last_name: "Hanks"
 *   });
 *   console.log(`Schauspieler aktualisiert: ${updatedActor.first_name} ${updatedActor.last_name}`);
 * } catch (error) {
 *   console.error("Fehler beim Aktualisieren des Schauspielers:", error);
 * }
 *
 * @param {number} id Schauspieler-ID
 * @param {ActorInput} payload Neue Werte für den Schauspieler (ohne actor_id)
 * @returns {Promise<Actor>} Das aktualisierte Actor-Objekt
 * @throws {Error} Wenn die Aktualisierung fehlschlägt
 */
export async function updateActor(id: number, payload: ActorInput): Promise<Actor> {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`updateActor(${id}) fehlgeschlagen: ${response.status}`);
    }

    const json = await response.json();
    return json.data;
}

/**
 * Löscht einen Schauspieler per ID (DELETE /actor/{id}).
 *
 * @example
 * try {
 *   await deleteActor(5);
 *   console.log("Schauspieler erfolgreich gelöscht");
 * } catch (error) {
 *   console.error("Fehler beim Löschen des Schauspielers:", error);
 * }
 *
 * @param {number} id Schauspieler-ID
 * @returns {Promise<void>} Promise ohne Rückgabewert
 * @throws {Error} Wenn das Löschen fehlschlägt
 */
export async function deleteActor(id: number): Promise<void> {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`deleteActor(${id}) fehlgeschlagen: ${response.status}`);
    }
}
