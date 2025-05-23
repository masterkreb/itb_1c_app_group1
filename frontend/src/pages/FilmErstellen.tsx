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

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateField = (name: string, value: any): string => {
        switch (name) {
            case 'title':
                if (!value || value.trim().length < 3) return 'Titel muss mindestens 3 Zeichen lang sein.';
                if (value.length > 100) return 'Titel darf maximal 100 Zeichen lang sein.';
                break;
            case 'description':
                if (value && value.length > 500) return 'Beschreibung darf maximal 500 Zeichen lang sein.';
                break;
            case 'release_year':
                if (!/^\d{4}$/.test(value)) return 'Bitte ein gültiges Jahr (z. B. 2023) angeben.';
                break;
            case 'rental_duration':
                if (!value || isNaN(value)) return 'Bitte eine gültige Ausleihdauer angeben.';
                break;
            case 'rental_rate':
                if (!/^\d+(\.\d{1,2})?$/.test(value)) return 'Bitte eine gültige Ausleihgebühr angeben.';
                break;
            case 'length':
                if (!value || isNaN(value)) return 'Bitte eine gültige Länge angeben.';
                break;
            case 'replacement_cost':
                if (!/^\d+(\.\d{1,2})?$/.test(value)) return 'Bitte gültige Ersatzkosten angeben.';
                break;
            case 'special_features':
                if (value && value.length > 200) return 'Maximal 200 Zeichen erlaubt.';
                break;
        }
        return '';
    };

    const validateAll = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        Object.entries(film).forEach(([key, value]) => {
            const err = validateField(key, value);
            if (err) newErrors[key] = err;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFilm({ ...film, [name]: value });
        setErrors({ ...errors, [name]: validateField(name, value) });
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
        if (!validateAll()) {
            alert('Bitte korrigieren Sie die Eingaben.');
            return;
        }

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
                    error={!!errors.title}
                    helperText={errors.title}
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
                    error={!!errors.description}
                    helperText={errors.description}
                    fullWidth
                />
                <TextField
                    label="Erscheinungsjahr"
                    name="release_year"
                    value={film.release_year}
                    onChange={handleChange}
                    error={!!errors.release_year}
                    helperText={errors.release_year}
                    fullWidth
                />
                <TextField
                    label="Ausleihdauer"
                    name="rental_duration"
                    value={film.rental_duration}
                    onChange={handleChange}
                    error={!!errors.rental_duration}
                    helperText={errors.rental_duration}
                    fullWidth
                />
                <TextField
                    label="Ausleihgebühr"
                    name="rental_rate"
                    value={film.rental_rate}
                    onChange={handleChange}
                    error={!!errors.rental_rate}
                    helperText={errors.rental_rate}
                    fullWidth
                />
                <TextField
                    label="Länge (Minuten)"
                    name="length"
                    type="number"
                    value={film.length}
                    onChange={handleChange}
                    error={!!errors.length}
                    helperText={errors.length}
                    fullWidth
                />
                <TextField
                    label="Ersatzkosten"
                    name="replacement_cost"
                    value={film.replacement_cost}
                    onChange={handleChange}
                    error={!!errors.replacement_cost}
                    helperText={errors.replacement_cost}
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
                    error={!!errors.special_features}
                    helperText={errors.special_features}
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
