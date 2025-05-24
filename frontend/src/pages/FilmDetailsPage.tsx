import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {Film, Actor} from "../types/types.ts";
import {getFilmById, addActorToFilm, removeActorFromFilm} from "../service/FilmService.ts";
import {getAllActors} from "../service/ActorService.ts";
import {Card, CardContent, Typography, List, ListItem, Stack, Button, Dialog, DialogTitle, DialogContent, CardActionArea, Snackbar, Alert} from "@mui/material";

const FilmDetailsPage = () => {
    const params = useParams<{id: string}>();
    const [film, setFilm] = React.useState<Film | null>(null);
    const [showActorSelection, setShowActorSelection] = useState<boolean>(false);
    const [availableActors, setAvailableActors] = useState<Actor[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<{text: string, type: 'success' | 'error'} | null>(null);

    const handleAddActor = async (actor: Actor) => {
        if (!film) return;

        try {
            setIsLoading(true);
            if (!film.film_id) {
                throw new Error('Film ID ist nicht definiert');
            }
            await addActorToFilm(film.film_id, actor.actor_id);

            // Film neu laden um die aktualisierte Schauspielerliste zu erhalten
            const updatedFilm = await getFilmById(film.film_id);
            setFilm(updatedFilm);

            setMessage({
                text: `${actor.first_name} ${actor.last_name} wurde erfolgreich hinzugefügt`,
                type: 'success'
            });

            // Dialog schließen
            setShowActorSelection(false);
        } catch (error) {
            console.error("Fehler beim Hinzufügen des Schauspielers:", error);
            setMessage({
                text: `Fehler beim Hinzufügen des Schauspielers: ${error}`,
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveActor = async (filmId: number, actorId: number) => {
        try {
            // Service-Funktion aufrufen um den Schauspieler vom Film zu entfernen
            await removeActorFromFilm(filmId, actorId);

            // Film-Daten neu laden um die aktuelle Liste der Schauspieler zu erhalten
            const updatedFilm = await getFilmById(filmId);
            if (updatedFilm) {
                setFilm(updatedFilm);
            }

            // Erfolgsmeldung anzeigen
            alert("Schauspieler erfolgreich vom Film entfernt");
        } catch (error) {
            console.error("Fehler beim Entfernen des Schauspielers:", error);
            alert("Fehler beim Entfernen des Schauspielers");
        }
    };


    // Filtere bereits zugewiesene Schauspieler aus der verfügbaren Liste
    const getFilteredActors = () => {
        if (!film?.actors) return availableActors;

        const existingActorIds = new Set(film.actors.map(actor => actor.actor_id));
        return availableActors.filter(actor => !existingActorIds.has(actor.actor_id));
    };


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
                                                <CardActionArea
                                                onClick={() => handleAddActor(actor)}
                                                disabled={isLoading}>
                                                    <Typography variant="h6">
                                                        {actor.first_name} {actor.last_name}
                                                    </Typography>
                                                </CardActionArea>
                                            </Card>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* Feedback-Nachricht */}
                    <Snackbar
                        open={message !== null}
                        autoHideDuration={6000}
                        onClose={() => setMessage(null)}
                    >
                        <Alert
                            onClose={() => setMessage(null)}
                            severity={message?.type}
                            sx={{ width: '100%' }}
                        >
                            {message?.text}
                        </Alert>
                    </Snackbar>


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
                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() => film.film_id && handleRemoveActor(film.film_id, actor.actor_id)}
                                            >
                                                Entfernen
                                            </Button>

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