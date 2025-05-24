import React, {  useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFilm } from '../service/FilmService';

import { Film, FilmRating } from '../types/types';
import {
    Button,
    Stack,
    TextField,
    MenuItem,
    Typography
} from '@mui/material';

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
        language_id:0
    });

    const [languages] = useState([
        { id: 1, name: 'English' },
        { id: 2, name: 'German' },
        { id: 3, name: 'Spanish' }
    ]);

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
                if (!/^\d{4}$/.test(value)) return 'Bitte ein gültiges Jahr angeben.';
                break;
            case 'rental_duration':
                if (!value || isNaN(value)) return 'Bitte eine gültige Ausleihdauer angeben.';
                break;
            case 'rental_rate':
                if (!/^\d+(\.\d{1,2})?$/.test(value)) return 'Bitte gültige Ausleihgebühr angeben.';
                break;
            case 'length':
                if (!value || isNaN(value)) return 'Bitte gültige Länge angeben.';
                break;
            case 'replacement_cost':
                if (!/^\d+(\.\d{1,2})?$/.test(value)) return 'Bitte gültige Ersatzkosten angeben.';
                break;
            case 'special_features':
                if (value && value.length > 200) return 'Maximal 200 Zeichen erlaubt.';
                break;
            case 'language_id':
                if (!value || isNaN(value)) return 'Bitte eine Sprache auswählen.';
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
        setFilm({ ...film, [name]: name === 'language_id' ? parseInt(value, 10) : value });
        setErrors({ ...errors, [name]: validateField(name, value) });
    };

    const handleSave = async () => {
        if (!validateAll()) {
            alert('Bitte korrigieren Sie die Eingaben.');
            return;
        }

        const preparedFilm = {
            ...film,
            release_year: parseInt(film.release_year, 10),
            rental_duration: parseInt(film.rental_duration, 10),
            rental_rate: parseFloat(film.rental_rate),
            replacement_cost: parseFloat(film.replacement_cost),
            length: Number(film.length),
            language_id: Number(film.language_id)
        };

        try {
            const newFilmId = await createFilm(preparedFilm as any);
            alert(`Film erfolgreich erstellt.`);
            navigate(`/film/details/${newFilmId}`);
        } catch (error) {
            console.error('Fehler beim Erstellen:', error);
            alert('Fehler beim Erstellen des Films.');
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>Neuen Film erstellen</Typography>
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
                    label="Länge"
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
                    label="Sprache"
                    name="language_id"
                    value={film.language_id}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.language_id}
                    helperText={errors.language_id}
                >
                    {languages.map(lang => (
                        <MenuItem key={lang.id} value={lang.id}>{lang.name}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Bewertung"
                    name="rating"
                    value={film.rating}
                    onChange={handleChange}
                    fullWidth
                >
                    {Object.values(FilmRating).map(rating => (
                        <MenuItem key={rating} value={rating}>{rating}</MenuItem>
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

                <Stack direction="row" spacing={2}>
                    <Button variant="contained" color="primary" onClick={handleSave}>Erstellen</Button>
                    <Button variant="outlined" color="secondary" onClick={() => navigate('/film')}>Zurück</Button>
                </Stack>
            </Stack>
        </div>
    );
};

export default FilmErstellen;
