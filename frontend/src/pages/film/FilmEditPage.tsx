import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import { useNavigate } from "react-router";
import Typography from "@mui/material/Typography";
import { Box, Stack, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import {getFilmById, updateFilm} from "../../service/FilmService.ts";



const FilmEditPage = () => {
    const navigate = useNavigate();

    const {id} = useParams(); // ID aus URL
    const [film, setFilm] = useState<any>(null); // Film wird gespeichert

    // neue Schauspieler Eingabefelder (Input) mit "+" Knopf
    const [newActors, setNewActors] = useState([{first_name: "", last_name: ""}]);

    // neuen Input hinzufügen (max. 5)
    const handleAddActorInput = () => {
        if (newActors.length < 5) {
            setNewActors([...newActors, {first_name: "", last_name: ""}]);
        }
    };

    // Textfeld ändern
    const handleActorChange = (index: number, field: "first_name" | "last_name", value: string) => {
        const updated = [...newActors];
        updated[index][field] = value;
        setNewActors(updated);
    };
    // Schauspieler aus Liste entfernen
    const handleRemoveActor = (actorId: number) => {
        const updatedActors = film.actors.filter((a: any) => a.actor_id !== actorId);
        setFilm({...film, actors: updatedActors});
    };


    const handleSave = async () => {
        if (!film) return;

        // neue Schauspieler zur Film-Actor-Liste hinzufügen
        const validActors = newActors.filter(a => a.first_name.trim() && a.last_name.trim());

        // aktuelle Schauspieler + neue kombinieren
        const combinedActors = [...film.actors.filter((a: any) => a.actor_id), ...validActors];


        const updatedFilm = {
            ...film,
            actors: combinedActors,
        };
        console.log("Daten, die an den Server gehen:", updatedFilm); //Kontrollpunkt, daten gehen zum Server..

        const success = await updateFilm(film.film_id.toString(), updatedFilm);

        if (success) {
            alert("Film gespeichert");
            navigate("/film");
        } else {
            alert("Speichern fehlgeschlagen");
        }
    };



    useEffect(() => {
        if (id) {
            getFilmById(id).then((data) => {
                if (data) {
                    setFilm(data); // Film-Daten speichern
                }
            });
        }
    }, [id]);

    if (!film) {
        return <div>Film wird geladen...</div>; // Wenn Film noch nicht da ist
    }

    return (
        <Box sx={{ my: 4,maxWidth: 600 }}>
            {/* Seite in zwei Spalten aufteilen */}
            <Stack direction="row" spacing={4} alignItems="flex-start">
                {/* linke Seite: Film-Informationen */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" gutterBottom>
                        Film bearbeiten
                    </Typography>

                    <Stack spacing={2}>
                        <TextField
                            label="Titel"
                            value={film.title}
                            onChange={(e) => setFilm({ ...film, title: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Beschreibung"
                            value={film.description}
                            onChange={(e) => setFilm({ ...film, description: e.target.value })}
                            fullWidth
                            multiline
                            rows={2}
                        />
                        <TextField
                            label="Jahr"
                            type="number"
                            value={film.release_year}
                            onChange={(e) => setFilm({ ...film, release_year: Number(e.target.value) })}
                            fullWidth
                        />
                        <TextField
                            label="Länge (Minuten)"
                            type="number"
                            value={film.length}
                            onChange={(e) => setFilm({ ...film, length: Number(e.target.value) })}
                            fullWidth
                        />
                        <TextField
                            label="Rating"
                            value={film.rating}
                            onChange={(e) => setFilm({ ...film, rating: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Rental Rate"
                            type="number"
                            value={film.rental_rate}
                            onChange={(e) => setFilm({ ...film, rental_rate: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Rental Duration (Tage)"
                            type="number"
                            value={film.rental_duration}
                            onChange={(e) => setFilm({ ...film, rental_duration: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Replacement Cost"
                            type="number"
                            value={film.replacement_cost}
                            onChange={(e) => setFilm({ ...film, replacement_cost: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Sprache"
                            value={film.language_id}
                            onChange={(e) => setFilm({ ...film, language_id: e.target.value })}
                            fullWidth
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                        >
                            Speichern
                        </Button>
                    </Stack>
                </Box>

                {/* rechte Seite: Schauspieler hinzufügen und anzeigen */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Schauspieler im Film
                    </Typography>

                    {/* neue Schauspieler Eingabe */}
                    <Stack spacing={2} mb={3}>
                        {newActors.map((actor, index) => (
                            <Stack direction="row" spacing={1} key={index}>
                                <TextField
                                    label="Vorname"
                                    value={actor.first_name}
                                    onChange={(e) => handleActorChange(index, "first_name", e.target.value)}
                                    fullWidth
                                />
                                <TextField
                                    label="Nachname"
                                    value={actor.last_name}
                                    onChange={(e) => handleActorChange(index, "last_name", e.target.value)}
                                    fullWidth
                                />
                            </Stack>
                        ))}
                        <Button
                            variant="outlined"
                            onClick={handleAddActorInput}
                            disabled={newActors.length >= 5}
                        >
                            + Schauspieler
                        </Button>
                    </Stack>

                    {/* bestehende Schauspieler anzeigen */}
                    <Stack spacing={1}>
                        {film.actors && film.actors.length > 0 ? (
                            film.actors.map((actor: any) => (
                                <Stack key={actor.actor_id} direction="row" spacing={2} alignItems="center">
                                    <span>{actor.first_name} {actor.last_name}</span>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => handleRemoveActor(actor.actor_id)}
                                    >
                                        Entfernen
                                    </Button>
                                </Stack>
                            ))
                        ) : (
                            <Typography color="text.secondary">Keine Schauspieler</Typography>
                        )}
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );

}

    export default FilmEditPage;
