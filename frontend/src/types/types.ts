export interface Film {
    film_id?: number,
    title: string,
    description: string,
    release_year: string,
    rental_duration: string,
    rental_rate: string,
    length: number,
    replacement_cost: string,
    rating: string,
    special_features: string,
    actors?: Actor[]
    categories?: Category[];
}

export interface Actor {
    actor_id: number,
    first_name: string,
    last_name: string,
    films?: Film[]
}


export enum FilmRating {
    G    = "G",
    PG   = "PG",
    PG13 = "PG-13",
    R    = "R",
    NC17 = "NC-17"
}

export interface Category {
    category_id: number;
    name: string;
}
