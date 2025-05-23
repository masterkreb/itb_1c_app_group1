// src/service/FilmActorService.ts

/**
 * Fügt einen Schauspieler zu einem Film hinzu (Verknüpfung in film_actor Tabelle)
 *
 * @example
 * // Fügt den Schauspieler mit ID 5 zum Film mit ID 10 hinzu
 * try {
 *   await addActorToFilm(10, 5);
 *   console.log("Schauspieler erfolgreich hinzugefügt");
 * } catch (error) {
 *   console.error("Fehler beim Hinzufügen des Schauspielers:", error);
 * }
 *
 * @param {number} filmId - Die ID des Films
 * @param {number} actorId - Die ID des Schauspielers
 * @returns {Promise<void>} - Promise ohne Rückgabewert
 * @throws {Error} Wenn die Anfrage fehlschlägt
 */
export async function addActorToFilm(filmId: number, actorId: number): Promise<void> {
    const response = await fetch(`http://localhost:3000/film/${filmId}/actor/${actorId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Fehler beim Hinzufügen des Schauspielers: ${response.status}`);
    }
}

/**
 * Entfernt einen Schauspieler aus einem Film (Löscht Verknüpfung in film_actor Tabelle)
 *
 * @example
 * // Entfernt den Schauspieler mit ID 5 aus dem Film mit ID 10
 * try {
 *   await removeActorFromFilm(10, 5);
 *   console.log("Schauspieler erfolgreich entfernt");
 * } catch (error) {
 *   console.error("Fehler beim Entfernen des Schauspielers:", error);
 * }
 *
 * @param {number} filmId - Die ID des Films
 * @param {number} actorId - Die ID des Schauspielers
 * @returns {Promise<void>} Promise ohne Rückgabewert
 * @throws {Error} Wenn die Anfrage fehlschlägt
 */
export async function removeActorFromFilm(filmId: number, actorId: number): Promise<void> {
    const response = await fetch(`http://localhost:3000/film/${filmId}/actor/${actorId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Fehler beim Entfernen des Schauspielers: ${response.status}`);
    }
}
