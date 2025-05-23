// frontend/src/service/FilmService.ts

import { Film} from "../types/types";

const baseUrl = "http://localhost:3000/film";

/**
 * Schema für API-Antworten vom Backend
 */
interface ApiResponse<T> {
    message: string;
    data: T;
}

/**
 * Lädt alle Filme, optional gefiltert nach einem Titelpräfix.
 * @param titleFilter Ein Filter-String; lädt nur Filme, deren Titel damit beginnt.
 */
export async function getAllFilms(titleFilter?: string): Promise<Film[] | undefined> {
    // Wenn ein Filter angegeben wurde, hänge ihn als Query-Param an
    const url = titleFilter
        ? `${baseUrl}?title=${encodeURIComponent(titleFilter)}`
        : baseUrl;

    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
        console.error("Error while fetching films:", response.status);
        return undefined;
    }

    const payload: { message: string; data: Film[] } = await response.json();
    return payload.data;
}

/**
 * Lädt einen einzelnen Film anhand seiner ID.
 */
export async function getFilmById(id: string): Promise<Film | undefined> {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
        console.error(`Error while fetching film ${id}:`, response.status);
        return undefined;
    }

    const payload: ApiResponse<Film> = await response.json();
    return payload.data;
}

/**
 * Legt einen neuen Film an und gibt die neu erzeugte ID zurück.
 */
export async function createFilm(film: Film): Promise<any> {
    const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(film)
    });

    if (!response.ok) {
        console.error("Error while creating film:", response.status);
        return undefined;
    }

    // Antwort: { message: string; id: number }
    const { id } = await response.json() as { message: string; id: number };
    return id;
}

/**
 * Aktualisiert einen Film und gibt die Anzahl der geänderten Datensätze zurück.
 */
export async function updateFilm(id: string, film: Partial<Film>): Promise<number | undefined> {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(film)
    });

    if (!response.ok) {
        console.error(`Error while updating film ${id}:`, response.status);
        return undefined;
    }

    // Antwort: { message: string; updatedCount: number }
    const { updatedCount } = await response.json() as { message: string; updatedCount: number };
    return updatedCount;
}

/**
 * Löscht einen Film und liefert true, wenn's geklappt hat.
 */
export async function deleteFilm(id: string): Promise<boolean> {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
        console.error(`Error while deleting film ${id}:`, response.status);
        return false;
    }

    return true;
}
