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

export async function getFilmById(id: number) {
    console.log("Start GetFilmById")
    const response = await fetch(`${baseUrl}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    console.log("Got response from server: ", response);
    if (!response.ok) {
        console.error("Error while fetching film: ", response.status);
    }
}