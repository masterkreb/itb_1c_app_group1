import { Actor } from '../types/types';

const baseUrl = 'http://localhost:3000/actor'; // Singular passend zum Backend

interface ApiResponse<T> {
    message: string;
    data: T;
}

/**
 * Holt alle Schauspieler.
 * @returns Array von Actor oder undefined bei Fehler
 */
export async function getAllActors(): Promise<Actor[] | undefined> {
    console.log('Start getAllActors');

    const response = await fetch(baseUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        console.error('Error while fetching actors:', response.status);
        return undefined;
    }

    const payload = (await response.json()) as ApiResponse<Actor[]>;
    console.log('Successfully getAllActors', payload.data);
    return payload.data;
}

/**
 * Holt einen einzelnen Schauspieler nach ID.
 * @param id ID des Schauspielers
 * @returns Actor-Objekt oder undefined bei Fehler
 */
export async function getActorById(id: string): Promise<Actor | undefined> {
    console.log(`Start getActorById: ${id}`);

    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        console.error(`Error while fetching actor with id ${id}:`, response.status);
        return undefined;
    }

    const payload = (await response.json()) as ApiResponse<Actor>;
    console.log('Successfully getActorById', payload.data);
    return payload.data;
}

/**
 * Legt einen neuen Schauspieler an und gibt die neue ID zurück.
 * @param actor Objekt mit first_name und last_name
 * @returns Neue Actor-ID oder undefined bei Fehler
 */
export async function createActor(actor: { first_name: string; last_name: string }): Promise<number | undefined> {
    console.log('Start createActor', actor);

    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actor)
    });

    if (!response.ok) {
        console.error('Error while creating actor:', response.status);
        return undefined;
    }

    const result = (await response.json()) as { message: string; id: number };
    console.log('Successfully createActor, new id:', result.id);
    return result.id;
}

/**
 * Aktualisiert einen Schauspieler.
 * @param id ID des zu aktualisierenden Schauspielers
 * @param actor Partial-Objekt mit first_name und/oder last_name
 * @returns Anzahl der aktualisierten Datensätze oder undefined bei Fehler
 */
export async function updateActor(
    id: string,
    actor: { first_name?: string; last_name?: string }
): Promise<number | undefined> {
    console.log(`Start updateActor: ${id}`, actor);

    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actor)
    });

    if (!response.ok) {
        console.error(`Error while updating actor with id ${id}:`, response.status);
        return undefined;
    }

    const result = (await response.json()) as { message: string; updatedCount: number };
    console.log('Successfully updateActor, updatedCount:', result.updatedCount);
    return result.updatedCount;
}

/**
 * Löscht einen Schauspieler.
 * @param id ID des zu löschenden Schauspielers
 * @returns true bei Erfolg, false bei Fehler
 */
export async function deleteActor(id: string): Promise<boolean> {
    console.log(`Start deleteActor: ${id}`);

    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        console.error(`Error while deleting actor with id ${id}:`, response.status);
        return false;
    }

    const result = await response.json();
    console.log("Successfully deleteActor", result);
    return result;
}
