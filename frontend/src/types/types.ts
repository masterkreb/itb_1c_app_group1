export interface Film {
    film_id?: number,
    title: string,
    description: string,
    release_year: string,
    rental_duration: string,
    rental_rate: string,
    length: string,
    replacement_cost: string,
    rating: string,
    special_features: string,
    actors?: Actor[]
}

export interface Actor {
    actor_id: number,
    first_name: string,
    last_name: string,
    films?: Film[]
}