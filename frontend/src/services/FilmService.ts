// src/services/FilmService.ts
import { Film } from "../types/types";

const baseUrl = "http://localhost:3000/film";

/**
 * Ruft alle Filme vom Server ab.
 * 
 * @example
 * // Beispiel: Alle Filme abrufen und in einer Liste anzeigen
 * const films = await getAllFilms();
 * if (films.length > 0) {
 *   // Filme in UI anzeigen
 * }
 * 
 * @returns {Promise<Film[]>} Array mit allen Filmen
 * @throws {Error} Bei Netzwerkfehlern oder Server-Fehlern
 */
export async function getAllFilms(): Promise<Film[]> {
    const response = await fetch(baseUrl);
    if (!response.ok) {
        throw new Error(`Fehler beim Laden der Filme: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.data as Film[];
}

/**
 * Ruft einen bestimmten Film anhand seiner ID ab.
 *
 * @example
 * // Beispiel: Film mit ID 1 abrufen und Details anzeigen
 * const film = await getFilmById(1);
 * if (film) {
 *   // Film-Details anzeigen
 * } else {
 *   // Fehlermeldung anzeigen
 * }
 *
 * @param {number} id - Die ID des abzurufenden Films
 * @returns {Promise<Film | null>} Der gefundene Film oder null bei Fehler
 * @throws {Error} Bei Netzwerkfehlern oder wenn der Film nicht existiert
 */
export async function getFilmById(id: number): Promise<Film | null> {
    try {
        const response = await fetch(`${baseUrl}/${id}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`Fehler beim Laden des Films (${response.status}):`, errorData);
            throw new Error(`Film nicht gefunden: ${errorData.message || response.statusText}`);
        }
        const data = await response.json();
        return data.data as Film;
    } catch (error) {
        console.error("Fehler in getFilmById:", error);
        return null;
    }
}

/**
 * Erstellt einen neuen Film.
 *
 * @example
 * // Beispiel: Neuen Film erstellen
 * const newFilm = {
 *   title: "Neuer Film",
 *   description: "Beschreibung",
 *   release_year: 2023,
 *   rental_duration: 3,
 *   rental_rate: 4.99,
 *   length: 120,
 *   replacement_cost: 19.99,
 *   rating: "PG-13",
 *   special_features: "Kommentare,Deleted Scenes"
 * };
 * await createFilm(newFilm);
 *
 * @param {Film} film - Die Daten des zu erstellenden Films
 * @returns {Promise<void>}
 * @throws {Error} Bei Netzwerkfehlern oder ungültigen Daten
 */
export async function createFilm(film: Film): Promise<void> {
    const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(film),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Fehler beim Erstellen des Films: ${errorData.message || response.statusText}`);
    }
}

/**
 * Aktualisiert einen bestehenden Film.
 *
 * @example
 * // Beispiel: Film mit ID 1 aktualisieren
 * const updatedFilm = {
 *   title: "Aktualisierter Titel",
 *   description: "Neue Beschreibung",
 *   // weitere Eigenschaften...
 * };
 * await updateFilm(1, updatedFilm);
 *
 * @param {number} id - Die ID des zu aktualisierenden Films
 * @param {Film} film - Die aktualisierten Filmdaten
 * @returns {Promise<void>}
 * @throws {Error} Bei Netzwerkfehlern oder ungültigen Daten
 */
export async function updateFilm(id: number, film: Film): Promise<void> {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(film),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Fehler beim Aktualisieren des Films: ${errorData.message || response.statusText}`);
    }
}

/**
 * Löscht einen Film anhand seiner ID.
 *
 * @example
 * // Beispiel: Film mit ID 1 löschen
 * await deleteFilm(1);
 *
 * @param {number} id - Die ID des zu löschenden Films
 * @returns {Promise<void>}
 * @throws {Error} Bei Netzwerkfehlern oder wenn der Film nicht existiert
 */
export async function deleteFilm(id: number): Promise<void> {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Fehler beim Löschen des Films: ${errorData.message || response.statusText}`);
    }
}

/**
 * Fügt einen Schauspieler zu einem Film hinzu.
 *
 * @example
 * // Beispiel: Schauspieler mit ID 1 zum Film mit ID 5 hinzufügen
 * await addActorToFilm(5, 1);
 *
 * @param {number} filmId - Die ID des Films
 * @param {number} actorId - Die ID des Schauspielers, der hinzugefügt werden soll
 * @returns {Promise<void>}
 * @throws {Error} Bei Netzwerkfehlern oder wenn Film oder Schauspieler nicht existieren
 */
export async function addActorToFilm(filmId: number, actorId: number): Promise<void> {
    const response = await fetch(`${baseUrl}/${filmId}/actor/${actorId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Fehler beim Hinzufügen des Schauspielers zum Film: ${errorData.message || response.statusText}`);
    }
}

/**
 * Entfernt einen Schauspieler von einem Film.
 *
 * @example
 * // Beispiel: Schauspieler mit ID 1 von Film mit ID 5 entfernen
 * await removeActorFromFilm(5, 1);
 *
 * @param {number} filmId - Die ID des Films
 * @param {number} actorId - Die ID des Schauspielers, der entfernt werden soll
 * @returns {Promise<void>}
 * @throws {Error} Bei Netzwerkfehlern oder wenn die Verknüpfung nicht existiert
 */
export async function removeActorFromFilm(filmId: number, actorId: number): Promise<void> {
    const response = await fetch(`${baseUrl}/${filmId}/actor/${actorId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Fehler beim Entfernen des Schauspielers vom Film: ${errorData.message || response.statusText}`);
    }
}

