"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import type { Actor, Film } from "../types/types.ts"
import { getActorById } from "../service/ActorService.ts"
import { getAllFilms } from "../service/FilmService.ts"
import {Card, CardContent, Typography, List, ListItem, Stack, Button, Dialog, DialogTitle, DialogContent} from "@mui/material";

const ActorDetailsPage = () => {
    const params = useParams<{ id: string }>()
    const [actor, setActor] = React.useState<Actor | null>(null)
    const [showFilmSelection, setShowFilmSelection] = useState<boolean>(false)
    const [availableFilms, setAvailableFilms] = useState<Film[]>([])
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    // Actor laden
    useEffect(() => {
        if (params.id) {
            const actorId = Number(params.id)
            if (!isNaN(actorId)) {
                getActorById(actorId)
                    .then(setActor)
                    .catch((error) => console.error("Fehler beim Laden des Schauspielers:", error))
            }
        }
    }, [params.id])

    // useEffect für das Laden der Filme
    useEffect(() => {
        if (showFilmSelection) {
            setIsLoading(true)
            getAllFilms()
                .then((films) => {
                    if (films) {
                        // Sortiere die Filme alphabetisch nach Titel
                        const sortedFilms = [...films].sort((a, b) => {
                            return a.title.localeCompare(b.title)
                        })
                        setAvailableFilms(sortedFilms)
                    }
                })
                .catch((error) => console.error("Fehler beim Laden der Filme:", error))
                .finally(() => setIsLoading(false))
        }
    }, [showFilmSelection])

    return (
        <div>
            <h2>Schauspieler Details</h2>
            {actor ? (
                <>
                    <h3>
                        {actor.first_name} {actor.last_name}
                    </h3>
                    <p>Schauspieler ID: {actor.actor_id}</p>
                    {actor.last_update && <p>Letzte Aktualisierung: {new Date(actor.last_update).toLocaleDateString()}</p>}

                    <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2 }}>
                        <Button variant="contained" onClick={() => setShowFilmSelection(true)}>
                            Film hinzufügen
                        </Button>
                    </Stack>

                    <Dialog open={showFilmSelection} onClose={() => setShowFilmSelection(false)} maxWidth="md" fullWidth>
                        <DialogTitle>Verfügbare Filme</DialogTitle>
                        <DialogContent>
                            {isLoading ? (
                                <Typography>Lade Filme...</Typography>
                            ) : (
                                <List>
                                    {availableFilms.map((film) => (
                                        <ListItem key={film.film_id}>
                                            <Card sx={{ width: "100%" }}>
                                                <CardContent>
                                                    <Typography variant="h6">{film.title}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Preis: {film.rental_rate} | Dauer: {film.rental_duration}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {film.description}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </DialogContent>
                    </Dialog>

                    <h4>Aktuelle Filme:</h4>
                    {actor.films && actor.films.length > 0 ? (
                        <List>
                            {actor.films.map((film) => (
                                <ListItem key={film.film_id}>
                                    <Card sx={{ width: "100%" }}>
                                        <CardContent>
                                            <Typography variant="h6">{film.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Preis: {film.rental_rate} | Dauer: {film.rental_duration}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {film.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography>Keine Filme verfügbar</Typography>
                    )}
                </>
            ) : (
                <p>Keine Schauspielerdaten verfügbar</p>
            )}
        </div>
    )
}

export default ActorDetailsPage
