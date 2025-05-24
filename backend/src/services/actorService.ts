import { db } from "../db";

// ⬇️ 1. CRUD-Funktionen für Actor

/**
 * Holt alle Actors.
 */
export async function getAllActors(): Promise<any[]> {
    return db()("actor").select("*");
}

export async function getActorById(id: number): Promise<any> {
    // 1. Actor selbst holen
    const actor = await db()("actor").where("actor_id", id).first();

    if (!actor) return null;

    // 2. Zugeordnete Filme über Join abfragen
    const films = await db()("film")
        .join("actor_film", "film.film_id", "actor_film.film_id")
        .where("actor_film.actor_id", id)
        .select("film.film_id", "film.title");

    // 3. Filme anhängen
    actor.films = films;

    return actor;
}

/**
 * Legt einen neuen Actor an und gibt die neue ID zurück.
 */
export async function createActor(data: any): Promise<number> {
    const [newId] = await db()("actor").insert({
        first_name: data.first_name,
        last_name: data.last_name
    });
    return newId;
}

/**
 * Aktualisiert einen bestehenden Actor.
 * Gibt die Anzahl geänderter Zeilen zurück (0 = nicht gefunden, 1 = ok).
 */
export async function updateActor(id: number, data: any): Promise<number> {
    return db()("actor")
        .where("actor_id", id)
        .update({
            first_name: data.first_name,
            last_name: data.last_name
        });
}

/**
 * Löscht einen Actor.
 * Gibt die Anzahl gelöschter Zeilen zurück.
 */
export async function deleteActor(id: number): Promise<number> {
    return db()("actor").where("actor_id", id).delete();
}

// ⬇️ 2. n:n-Mapping Actor ↔ Film

/**
 * Fügt einem Actor einen Film hinzu.
 */
export async function addActorToFilm(actorId: number, filmId: number): Promise<number[]> {
    return db()("actor_film").insert({
        actor_id: actorId,
        film_id: filmId
    });
}

/**
 * Entfernt die Verknüpfung Actor ↔ Film.
 */
export async function deleteActorFilm(actorId: number, filmId: number): Promise<number> {
    return db()("actor_film")
        .where({ actor_id: actorId, film_id: filmId })
        .delete();
}
