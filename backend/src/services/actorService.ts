/**
 * @file actorService.ts
 * @description Enthält Service-Funktionen für den Zugriff auf Actor-Daten in der Datenbank.
 * Unterstützt CRUD-Operationen sowie das Verknüpfen und Entfernen von Filmen mit Schauspielern.
 */

import { db } from "../db";

/**
 * Holt alle Schauspieler aus der Datenbank.
 *
 * @returns {Promise<any[]>} Eine Liste aller Schauspieler.
 *
 * @example
 * const actors = await getAllActors();
 */
export async function getAllActors(): Promise<any[]> {
    const connection = db();
    const actors = await connection("actor").select("*");
    console.log("Selected actors:", actors);
    return actors;
}

/**
 * Holt einen einzelnen Schauspieler anhand seiner ID.
 *
 * @param {number} id - Die ID des Schauspielers.
 * @returns {Promise<any>} Der Schauspieler oder `undefined`, wenn nicht gefunden.
 *
 * @example
 * const actor = await getActorById(5);
 */
export async function getActorById(id: number): Promise<any> {
    const connection = db();
    const actor = await connection("actor")
        .where("actor_id", id)
        .first();
    console.log("Selected actor:", actor);
    return actor;
}

/**
 * Erstellt einen neuen Schauspieler in der Datenbank.
 *
 * @param {Object} data - Ein Objekt mit Vor- und Nachname des Schauspielers.
 * @returns {Promise<number>} Die ID des neu erstellten Schauspielers.
 *
 * @example
 * const newId = await createActor({ first_name: "Emma", last_name: "Watson" });
 */
export async function createActor(data: { first_name: string; last_name: string }): Promise<number> {
    const connection = db();
    const result = await connection("actor").insert({
        first_name: data.first_name,
        last_name: data.last_name
    });
    console.log("Created actor with result:", result);
    return result[0];
}

/**
 * Aktualisiert die Daten eines vorhandenen Schauspielers.
 *
 * @param {number} id - Die ID des Schauspielers.
 * @param {Object} data - Neue Werte für Vor- und Nachname.
 * @returns {Promise<number>} Anzahl der aktualisierten Zeilen.
 *
 * @example
 * const updated = await updateActor(3, { first_name: "Tom", last_name: "Hardy" });
 */
export async function updateActor(id: number, data: { first_name: string; last_name: string }): Promise<number> {
    const connection = db();
    const updatedCount = await connection("actor")
        .where("actor_id", id)
        .update({
            first_name: data.first_name,
            last_name: data.last_name
        });
    console.log("Updated actor:", updatedCount);
    return updatedCount;
}

/**
 * Löscht einen Schauspieler anhand seiner ID.
 *
 * @param {number} id - Die ID des Schauspielers.
 * @returns {Promise<number>} Anzahl der gelöschten Zeilen.
 *
 * @example
 * const deleted = await deleteActor(7);
 */
export async function deleteActor(id: number): Promise<number> {
    const connection = db();
    const deletedCount = await connection("actor")
        .where("actor_id", id)
        .delete();
    console.log("Deleted actor:", deletedCount);
    return deletedCount;
}

/**
 * Verknüpft einen Schauspieler mit einem Film.
 *
 * @param {number} actorId - Die ID des Schauspielers.
 * @param {number} filmId - Die ID des Films.
 * @returns {Promise<number[]>} Das Ergebnis der Insert-Operation.
 *
 * @example
 * const result = await addActorToFilm(2, 4);
 */
export async function addActorToFilm(actorId: number, filmId: number): Promise<number[]> {
    const connection = db();
    const result = await connection("actor_film").insert({
        actor_id: actorId,
        film_id: filmId
    });
    console.log("Inserted actor-film link:", result);
    return result;
}

/**
 * Entfernt die Verknüpfung zwischen einem Schauspieler und einem Film.
 *
 * @param {number} actorId - Die ID des Schauspielers.
 * @param {number} filmId - Die ID des Films.
 * @returns {Promise<number>} Anzahl der gelöschten Zeilen.
 *
 * @example
 * const result = await deleteActorFilm(2, 4);
 */
export async function deleteActorFilm(actorId: number, filmId: number): Promise<number> {
    const connection = db();
    const deletedCount = await connection("actor_film")
        .where({ actor_id: actorId, film_id: filmId })
        .delete();
    console.log("Deleted actor-film link:", deletedCount);
    return deletedCount;
}