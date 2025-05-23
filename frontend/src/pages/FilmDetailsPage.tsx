import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {Film, Actor} from "../types/types.ts";
import {getFilmById} from "../service/FilmService.ts";
import {getAllActors} from "../service/ActorService.ts";
import {Card, CardContent, Typography, List, ListItem, Stack, Button, Dialog, DialogTitle, DialogContent} from "@mui/material";

const FilmDetailsPage = () => {
    const params = useParams<{id: string}>();
    const [film, setFilm] = React.useState<Film | null>(null);
    const [showActorSelection, setShowActorSelection] = useState<boolean>(false);
    const [availableActors, setAvailableActors] = useState<Actor[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    // Film laden
    useEffect(() => {
        if (params.id) {
            const filmId = Number(params.id);
            if (!isNaN(filmId)) {
                getFilmById(filmId)
                    .then(setFilm)
                    .catch(error => console.error("Fehler beim Laden des Films:", error));
            }
        }
    }, [params.id]);

// useEffect für das Laden der Schauspieler
useEffect(() => {
    if (showActorSelection) {
        setIsLoading(true);
        getAllActors()
            .then(actors => {
                if (actors) {
                    // Sortiere die Schauspieler alphabetisch nach Nachnamen, dann Vornamen
                    const sortedActors = [...actors].sort((a, b) => {
                        // Primär nach Nachnamen sortieren
                        const lastNameComparison = a.last_name.localeCompare(b.last_name);
                        // Bei gleichem Nachnamen nach Vornamen sortieren
                        if (lastNameComparison === 0) {
                            return a.first_name.localeCompare(b.first_name);
                        }
                        return lastNameComparison;
                    });
                    setAvailableActors(sortedActors);
                }
            })
            .catch(error => console.error("Fehler beim Laden der Schauspieler:", error))
            .finally(() => setIsLoading(false));
    }
}, [showActorSelection]);

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
                        <Button
                            variant="contained"
                            onClick={() => setShowActorSelection(true)}
                        >
                            Schauspieler hinzufügen
                        </Button>
                    </Stack>

                    <Dialog
                        open={showActorSelection}
                        onClose={() => setShowActorSelection(false)}
                        maxWidth="md"
                        fullWidth
                    >
                        <DialogTitle>Verfügbare Schauspieler</DialogTitle>
                        <DialogContent>
                            {isLoading ? (
                                <Typography>Lade Schauspieler...</Typography>
                            ) : (
                                <List>
                                    {availableActors.map((actor) => (
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
                            )}
                        </DialogContent>
                    </Dialog>

                    <h4>Aktuelle Schauspieler:</h4>
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
                </>
            ) : (
                <p>Keine Filmdaten verfügbar</p>
            )}
        </div>
    );
};

export default FilmDetailsPage;