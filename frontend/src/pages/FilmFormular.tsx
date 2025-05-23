import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFilmById, updateFilm, deleteFilm } from '../service/FilmService';
import { Film, FilmRating } from '../types/types';
import { Button, Stack, TextField, MenuItem, Typography} from '@mui/material';

const FilmFormular: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [film, setFilm] = useState<Film | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchFilm = async () => {
            if (id) {
                const data = await getFilmById(id);
                if (data) {
                    setFilm(data);
                }
            }
            setIsLoading(false);
        };

        fetchFilm();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (film) {
            setFilm({ ...film, [name]: value });
        }
    };

    const handleSave = async () => {
        if (film && id) {
            const updatedCount = await updateFilm(id, film);
            if (updatedCount) {
                alert(`Film erfolgreich aktualisiert.`);
                navigate('/film');
            } else {
                alert('Fehler beim Aktualisieren des Films.');
            }
        }
    };

    const handleDelete = async () => {
        if (id && window.confirm('Möchten Sie diesen Film wirklich löschen?')) {
            const success = await deleteFilm(id);
            if (success) {
                alert('Film erfolgreich gelöscht.');
                navigate('/film');
            } else {
                alert('Fehler beim Löschen des Films.');
            }
        }
    };

    if (isLoading) {
        return <Typography>Lädt...</Typography>;
    }

    if (!film) {
        return <Typography>Film nicht gefunden.</Typography>;
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Film bearbeiten
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

                {/* Schauspieler anzeigen und bearbeiten */}
                <TextField
                    label="Schauspieler"
                    name="actors"
                    value={
                        film.actors
                            ?.map(actor => `${actor.first_name} ${actor.last_name}`)
                            .join(', ') || ''
                    }
                    onChange={handleChange}
                    fullWidth
                />

                <Stack direction="row" spacing={2}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Speichern
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => navigate('/film')}>
                        Zurück
                    </Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>
                        Löschen
                    </Button>
                </Stack>
            </Stack>
        </div>
    );
};

export default FilmFormular;
