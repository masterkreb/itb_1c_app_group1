// src/service/FilmService.ts

import { Film, FilmInput } from "../types/types";

const baseUrl = "http://localhost:3000/film";

/**
 * Ruft alle Filme ab (GET /film).
 *
 * @example
 * const films = await getAllFilms();
 * if (films) {
 *   console.log(`${films.length} Filme gefunden`);
 * }
 *
 * @returns {Promise<Film[] | undefined>} Array von Film-Objekten oder undefined bei einem Fehler
 * @throws Keine Exceptions, gibt undefined zurück bei Fehlern
 */
export async function getAllFilms(): Promise<Film[] | undefined> {
    console.log("Start GetFilms");

    const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    console.log("Got response from server: ", response);
    if (!response.ok) {
        console.error("Error while fetching films: ", response.status);
        return undefined;
    }

    const json = await response.json();
    // Je nachdem, wie dein Backend die Daten verpackt:
    // z.B. { data: [ { film_id: … }, … ] }
    return json.data;
}

/**
 * Ruft einen einzelnen Film per ID ab (GET /film/{id}).
 * @param id Film-ID
 * @returns Das einzelne Film-Objekt
 * @throws Error, falls nicht ok
 */
export async function getFilmById(id: number): Promise<Film> {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Film mit ID ${id} nicht gefunden (Status ${response.status})`);
    }

    const json = await response.json();
    return json.data;
}

/**
 * Legt einen neuen Film an (POST /film).
 * @param payload Daten für den neuen Film (ohne film_id)
 * @returns Das neu angelegte Film-Objekt (mit film_id)
 * @throws Error, falls nicht ok
 */
export async function createFilm(payload: FilmInput): Promise<Film> {
    const response = await fetch(baseUrl, {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`createFilm fehlgeschlagen: ${response.status}`);
    }

    const json = await response.json();
    return json.data;
}

/**
 * Aktualisiert einen bestehenden Film per ID (PUT /film/{id}).
 * @param id Film-ID
 * @param payload Neue Werte für den Film (ohne film_id)
 * @returns Das aktualisierte Film-Objekt
 * @throws Error, falls nicht ok
 */
export async function updateFilm(
    id: number,
    payload: FilmInput
): Promise<Film> {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`updateFilm(${id}) fehlgeschlagen: ${response.status}`);
    }

    const json = await response.json();
    return json.data;
}

/**
 * Löscht einen Film per ID (DELETE /film/{id}).
 * @param id Film-ID
 * @throws Error, falls nicht ok
 */
export async function deleteFilm(id: number): Promise<void> {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`deleteFilm(${id}) fehlgeschlagen: ${response.status}`);
    }
}
