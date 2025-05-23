const baseUrl = "http://localhost:3000/actor";
//
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
    return tempActors.data;
}

export async function getActorById(id: number) {
    console.log("Start GetActorById")
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    console.log("Got response from server: ", response);
    if (!response.ok) {
        console.error("Error while fetching actor: ", response.status);
    }
}