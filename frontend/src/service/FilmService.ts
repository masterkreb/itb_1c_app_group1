import {Film} from "../types/types.ts";

const baseUrl = "http://localhost:3000/film";

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

export async function getFilmById(id: number): Promise<Film> {
    console.log("Start GetFilmById");
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    
    console.log("Got response from server: ", response);
    
    if (!response.ok) {
        throw new Error(`Fehler beim Laden des Films: ${response.status}`);
    }
    
    const result = await response.json();
    // Extrahiere die Filmdaten aus dem data-Objekt.
    return result.data;
}

export async function addActorToFilm(filmId: number, actorId: number) {
    console.log(`Adding actor ${actorId} to film ${filmId}`);

    const response = await fetch(`${baseUrl}/${filmId}/actor/${actorId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Fehler beim Hinzufügen des Schauspielers: ${response.status}`);
    }

    return response.json();
}

export async function removeActorFromFilm(filmId: number, actorId: number) {
    console.log(`Removing actor ${actorId} from film ${filmId}`);

    const response = await fetch(`${baseUrl}/${filmId}/actor/${actorId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Fehler beim Entfernen des Schauspielers: ${response.status}`);
    }

    return response.json();
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

export async function deleteFilm(filmId: number) {
    const response = await fetch(`${baseUrl}/${filmId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Fehler beim Löschen des Films: ${response.status}`);
    }

    return response.json();
}