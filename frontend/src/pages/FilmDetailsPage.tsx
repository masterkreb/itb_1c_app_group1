// noinspection JSUnusedLocalSymbols

import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import JsonView from "@uiw/react-json-view";
import {Film} from "../types/types.ts"
import {getFilmById} from "../service/FilmService.ts";
import {Card, CardContent, Typography, List, ListItem, Stack, Button} from "@mui/material";

const FilmDetailsPage = () => {
    const params = useParams<{id: string}>();
    const [film, setFilm] = React.useState<Film | null>(null);


    useEffect(() => {
        if (params.id) {
            const filmId = Number(params.id);
            if (isNaN(filmId)) {
                console.error("Ungültige Film-ID");
                return;
            }

            getFilmById(filmId)
                .then(response => {
                    console.log("Empfangene Filmdaten:", response); // Debugging
                    setFilm(response);
                })
                .catch(error => {
                    console.error("Fehler beim Laden des Films:", error);
                });
        }
    }, [params.id]);

    return (
        <div>
            <h2>Film Details</h2>
            {film ? (
                <>
                    <h3>{film.title}</h3>
                    <p>Preis: {film.rental_rate}</p>
                    <p>Dauer: {film.rental_duration}</p>
                    <p>Beschreibung: {film.description}</p>

                    <Stack direction="row" spacing={2}>
                        <Button variant={"contained"}>Add Actor</Button>
                    </Stack>
                    
                    <h4>Schauspieler:</h4>
                    {film.actors && film.actors.length > 0 ? (
                        <List>
                            {film.actors.map((actor) => (
                                <ListItem key={actor.actor_id}>
                                    <Card sx={{width: '100%'}}>
                                        <CardContent>
                                            <Typography variant="h6">
                                                {actor.first_name} {actor.last_name}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography>Keine Schauspieler verfügbar</Typography>
                    )}

                    <h4>Rohdaten:</h4>
                    <JsonView value={film} />
                </>
            ) : (
                <p>Keine Filmdaten verfügbar</p>
            )}
        </div>
    );
};

export default FilmDetailsPage;