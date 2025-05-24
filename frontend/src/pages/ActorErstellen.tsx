import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField, Button, Stack, Typography,
    FormControl, InputLabel, Select, MenuItem,
    Checkbox, OutlinedInput, ListItemText
} from '@mui/material';
import { createActor, addFilmToActor } from '../service/ActorService';
import { getAllFilms } from '../service/FilmService';
import { Film } from '../types/types';

const ActorErstellen: React.FC = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [selectedFilmIds, setSelectedFilmIds] = useState<number[]>([]);
    const [availableFilms, setAvailableFilms] = useState<Film[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        async function fetchFilms() {
            const films = await getAllFilms();
            setAvailableFilms(films || []);
        }
        fetchFilms();
    }, []);

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'first_name':
            case 'last_name':
                if (!value || value.trim().length < 2) return 'Mindestens 2 Zeichen erforderlich.';
                if (value.length > 50) return 'Maximal 50 Zeichen erlaubt.';
                break;
            default:
                return '';
        }
        return '';
    };

    const validateAll = (): boolean => {
        const newErrors: { [key: string]: string } = {
            first_name: validateField('first_name', firstName),
            last_name: validateField('last_name', lastName)
        };
        setErrors(newErrors);
        return Object.values(newErrors).every(err => !err);
    };

    const handleSave = async () => {
        if (!validateAll()) {
            alert('Bitte korrigieren Sie die Eingaben.');
            return;
        }

        const newActor = {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            film_ids: selectedFilmIds
        };

        try {
            const newId = await createActor(newActor);

            // Filme dem neuen Schauspieler zuordnen
            for (const filmId of selectedFilmIds) {
                if (typeof newId === "number") {
                    await addFilmToActor(filmId, newId);
                }
            }

            alert('Schauspieler erfolgreich erstellt.');
            navigate(`/actor/details/${newId}`);
        } catch (error) {
            console.error('Fehler beim Erstellen:', error);
            alert('Fehler beim Erstellen des Schauspielers.');
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>Neuen Schauspieler erstellen</Typography>
            <Stack spacing={2}>
                <TextField
                    label="Vorname"
                    value={firstName}
                    onChange={(e) => {
                        setFirstName(e.target.value);
                        setErrors({ ...errors, first_name: validateField('first_name', e.target.value) });
                    }}
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                    fullWidth
                    required
                />
                <TextField
                    label="Nachname"
                    value={lastName}
                    onChange={(e) => {
                        setLastName(e.target.value);
                        setErrors({ ...errors, last_name: validateField('last_name', e.target.value) });
                    }}
                    error={!!errors.last_name}
                    helperText={errors.last_name}
                    fullWidth
                    required
                />

                <FormControl fullWidth>
                    <InputLabel id="film-select-label">Filme</InputLabel>
                    <Select
                        labelId="film-select-label"
                        multiple
                        value={selectedFilmIds}
                        onChange={(e) => setSelectedFilmIds(e.target.value as number[])}
                        input={<OutlinedInput label="Filme" />}
                        renderValue={(selected) =>
                            (selected as number[])
                                .map(id => {
                                    const film = availableFilms.find(f => f.film_id === id);
                                    return film ? film.title : id;
                                })
                                .join(', ')
                        }
                    >
                        {availableFilms.map((film) => (
                            <MenuItem key={film.film_id} value={film.film_id}>
                                <Checkbox checked={film.film_id !== undefined && selectedFilmIds.includes(film.film_id)} />

                                <ListItemText primary={film.title} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Stack direction="row" spacing={2}>
                    <Button variant="contained" color="primary" onClick={handleSave}>Erstellen</Button>
                    <Button variant="outlined" color="secondary" onClick={() => navigate('/actor')}>Zurück</Button>
                </Stack>
            </Stack>
        </div>
    );
};

export default ActorErstellen;
