/**
 * Repräsentiert einen Film mit allen Eigenschaften
 */
export interface Film {
    film_id: number;
    title: string;
    description?: string;
    release_year?: number;
    language_id: number;
    rental_duration: number;
    rental_rate: number;
    length?: number;
    replacement_cost: number;
    rating?: string;
    special_features?: string;
    last_update?: string;
    actors?: Actor[]; // Verknüpfte Schauspieler
}

/**
 * Eingabedaten für einen neuen oder zu aktualisierenden Film (ohne ID)
 */
export interface FilmInput {
    title: string;
    description?: string;
    release_year?: number;
    language_id: number;
    rental_duration: number;
    rental_rate: number;
    length?: number;
    replacement_cost: number;
    rating?: string;
    special_features?: string;
}

/**
 * Repräsentiert einen Schauspieler mit allen Eigenschaften
 */
export interface Actor {
    actor_id: number;
    first_name: string;
    last_name: string;
    last_update?: string;
    films?: Film[]; // Verknüpfte Filme
}

/**
 * Eingabedaten für einen neuen oder zu aktualisierenden Schauspieler (ohne ID)
 */
export interface ActorInput {
    first_name: string;
    last_name: string;
}