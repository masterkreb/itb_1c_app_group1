import type { Actor } from "../types/types.ts"

const baseUrl = "http://localhost:3000/actor"

export async function getAllActors() {
    console.log("Start GetActors")

    const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    console.log("Got response from server: ", response)
    if (!response.ok) {
        console.error("Error while fetching actors: ", response.status)
        return undefined
    }

    const tempActors = await response.json()
    return tempActors.data
}

export async function getActorById(id: number): Promise<Actor> {
    console.log("Start GetActorById")
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    console.log("Got response from server: ", response)

    if (!response.ok) {
        throw new Error(`Fehler beim Laden des Schauspielers: ${response.status}`)
    }

    const result = await response.json()
    return result.data
}

export async function createActor(actor: Omit<Actor, "actor_id">): Promise<Actor> {
    console.log("Start CreateActor")
    const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(actor),
    })

    console.log("Got response from server: ", response)

    if (!response.ok) {
        throw new Error(`Fehler beim Erstellen des Schauspielers: ${response.status}`)
    }

    const result = await response.json()
    return result.data
}

export async function updateActor(id: number, actor: Partial<Actor>): Promise<Actor> {
    console.log("Start UpdateActor")
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(actor),
    })

    console.log("Got response from server: ", response)

    if (!response.ok) {
        throw new Error(`Fehler beim Aktualisieren des Schauspielers: ${response.status}`)
    }

    const result = await response.json()
    return result.data
}

export async function deleteActor(id: number) {
    console.log("Start DeleteActor")
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })

    console.log("Got response from server: ", response)

    if (!response.ok) {
        console.error("Error while deleting actor: ", response.status)
        return false
    }

    return true
}

/**
 * Fügt einen Film zu einem Schauspieler hinzu über Film Endpoint
 * WICHTIG: Verwendet ausschließlich den Film Endpoint wie gefordert
 */
export async function addFilmToActor(filmId: number, actorId: number): Promise<boolean> {
    console.log(`Start AddFilmToActor - Film ${filmId} zu Actor ${actorId}`)

    const response = await fetch(`http://localhost:3000/film/${filmId}/actor/${actorId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })

    console.log("Got response from server: ", response)

    if (!response.ok) {
        console.error("Error while adding film to actor: ", response.status)
        return false
    }

    return true
}

/**
 * Entfernt einen Film von einem Schauspieler über Film Endpoint
 * WICHTIG: Verwendet ausschließlich den Film Endpoint wie gefordert
 */
export async function removeFilmFromActor(filmId: number, actorId: number): Promise<boolean> {
    console.log(`Start RemoveFilmFromActor - Film ${filmId} von Actor ${actorId}`)

    const response = await fetch(`http://localhost:3000/film/${filmId}/actor/${actorId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })

    console.log("Got response from server: ", response)

    if (!response.ok) {
        console.error("Error while removing film from actor: ", response.status)
        return false
    }

    return true
}
//