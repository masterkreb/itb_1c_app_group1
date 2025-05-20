const baseUrl = "http://localhost:3000/actor";

/**
 * Lädt Liste aller Actor.
 * @returns Ein Array mit allen Schauspieler oder undefined bei Fehler
 */
export async function getAllActors() {
    console.log("Start GetActors")

    const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    console.log("Got response from server: ", response);
    if (!response.ok) {
        console.error("Error while fetching actors: ", response.status);
        return undefined;
    }

    const tempActors = await response.json();
    console.log("Got actors from server: ", tempActors.data)
    return tempActors.data;

}

/**
 * Lädt einen einzelnen Actor anhand der ID vom Server.
 * @param id - Die Actor-ID
 * @returns Ein Actor-Objekt oder undefined bei Fehler
 */
export async function getActorById(id: string) {
    console.log("Start GetActorById");

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });

    console.log("Got response from server: ", response);

    if (!response.ok) {
        console.error("Error while fetching actor: ", response.status);
        return undefined;
    }

    const tempActor = await response.json();
    return tempActor.data;
}

/**
 * Erstellt einen neuen Schauspieler.
 * @param actor Schauspieler-Objekt mit beliebiger Struktur
 * @returns id vom neu erstellten Schauspieler oder false bei Fehler
 */
export async function createActor(actor: object) {
    console.log("Start CreateActor");

    const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(actor)
    });

    console.log("CreateActor response: ", response);

    if (!response.ok) {
        console.error("Error while creating actor: ", response.status);
        return false;
    }

    const result = await response.json();
    console.log("Created actor: ", result.id);
    return result.id;
}

/**
 * Aktualisiert einen bestehenden Schauspieler.
 * @param id ID des zu bearbeitenden Schauspieler
 * @param actor Schauspieler-Objekt mit beliebiger Struktur
 * @returns true wenn die Änderung erfolgreich war und false bei Fehler
 */
export async function updateActor(id: string, actor: object) {
    console.log("Start UpdateActor");

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(actor)
    });

    console.log("UpdateActor response: ", response);

    if (!response.ok) {
        console.error("Error while updating actor: ", response.status);
        return false;
    }

    return true;
}

/**
 * Löscht einen Schauspieler anhand der ID.
 * @param id ID des zu löschenden Schauspieler
 * @returns true wenn die Löschung erfolgreich war und false bei Fehler
 */
export async function deleteActor(id: string) {
    console.log("Start DeleteActor");

    const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });

    console.log("DeleteActor response: ", response);

    if (!response.ok) {
        console.error("Error while deleting actor: ", response.status);
        return false;
    }

    return true;
}