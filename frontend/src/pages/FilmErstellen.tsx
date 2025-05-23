import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFilm } from '../service/FilmService';
import { Film, Actor, FilmRating } from '../types/types';
import { Button, Stack, TextField, MenuItem, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';

const FilmErstellen: React.FC = () => {
    const navigate = useNavigate();

    const [film, setFilm] = useState<Film>({
        title: '',
        description: '',
        release_year: '',
        rental_duration: '',
        rental_rate: '',
        length: 0,
        replacement_cost: '',
        rating: '',
        special_features: '',
        actors: [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFilm({ ...film, [name]: value });
    };

    const handleActorChange = (index: number, field: keyof Actor, value: string) => {
        const updatedActors = [...(film.actors || [])];
        updatedActors[index] = {
            ...updatedActors[index],
            [field]: field === "actor_id" ? Number(value) : value,
        };
        setFilm({ ...film, actors: updatedActors });
    };

    const handleAddActor = () => {
        const newActor: Actor = { actor_id: 0, first_name: '', last_name: '' };
        setFilm({ ...film, actors: [...(film.actors || []), newActor] });
    };

    const handleSave = async () => {
        const newFilmId = await createFilm(film);
        if (newFilmId) {
            alert(`Neuer Film erfolgreich erstellt.`);
            navigate(`/film/details/${newFilmId}`);
        } else {
            alert('Fehler beim Erstellen des neuen Films.');
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Neuen Film erstellen
            </Typography>
            <Stack spacing={2}>
                <TextField
                    label="Titel"
                    name="title"
                    value={film.title}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Beschreibung"
                    name="description"
                    value={film.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                />
                <TextField
                    label="Erscheinungsjahr"
                    name="release_year"
                    value={film.release_year}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Ausleihdauer"
                    name="rental_duration"
                    value={film.rental_duration}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Ausleihgebühr"
                    name="rental_rate"
                    value={film.rental_rate}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Länge (Minuten)"
                    name="length"
                    type="number"
                    value={film.length}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Ersatzkosten"
                    name="replacement_cost"
                    value={film.replacement_cost}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    select
                    label="Bewertung"
                    name="rating"
                    value={film.rating}
                    onChange={handleChange}
                    fullWidth
                >
                    {Object.values(FilmRating).map(rating => (
                        <MenuItem key={rating} value={rating}>
                            {rating}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Besondere Features"
                    name="special_features"
                    value={film.special_features}
                    onChange={handleChange}
                    fullWidth
                />

                <Typography variant="h6">Schauspieler</Typography>
                {film.actors?.map((actor, index) => (
                    <Stack direction="row" spacing={2} key={index} alignItems="center">
                        <TextField
                            label="Vorname"
                            value={actor.first_name}
                            onChange={e => handleActorChange(index, 'first_name', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Nachname"
                            value={actor.last_name}
                            onChange={e => handleActorChange(index, 'last_name', e.target.value)}
                            fullWidth
                        />
                    </Stack>
                ))}
                <Button variant="contained" color="primary" onClick={handleAddActor} startIcon={<Add />}>
                    Schauspieler hinzufügen
                </Button>

                <Stack direction="row" spacing={2}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Erstellen
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => navigate('/film')}>
                        Zurück
                    </Button>
                </Stack>
            </Stack>
        </div>
    );
};

export default FilmErstellen;
