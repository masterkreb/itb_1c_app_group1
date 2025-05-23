// noinspection JSUnusedLocalSymbols

import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import JsonView from "@uiw/react-json-view";
import {Film} from "../types/types.ts"
import {getFilmById} from "../service/FilmService.ts";

const FilmDetailsPage = () => {
    const params = useParams<{id: string}>();
    const [films, setFilms] = React.useState<Film | null>(null);

    useEffect(() => {
        if (params.id) {
            const filmId = Number(params.id);
            if (isNaN(filmId)) {
                console.error("Ungültige Film-ID");
                return;
            }

            getFilmById(filmId)
                .then(response => {
                    setFilms(response);
                });
        }
    }, [params.id]);

    return (
        <div>
            <h2>Film Details</h2>
            {films ? (
                <JsonView value={films} />
            ) : (
                <p>Keine Filmdaten verfügbar</p>
            )}
        </div>
    );
};

export default FilmDetailsPage;