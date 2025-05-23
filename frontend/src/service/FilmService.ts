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