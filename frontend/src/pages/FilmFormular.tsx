import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFilmById, updateFilm, deleteFilm } from '../service/FilmService';
import { Film, FilmRating } from '../types/types';
import {
    Button,
    Stack,
    TextField,
    MenuItem,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

type ValidationError = {
    [field in keyof Partial<Film>]?: string;
};

const FilmFormular: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [film, setFilm] = useState<Film | null>(null);
    const [errors, setErrors] = useState<ValidationError>({});
    const [isLoading, setIsLoading] = useState(true);

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);

    useEffect(() => {
        const fetchFilm = async () => {
            if (id) {
                const data = await getFilmById(id);
                if (data) setFilm(data);
            }
            setIsLoading(false);
        };
        fetchFilm();
    }, [id]);

    const validateField = (name: string, value: any): string => {
        switch (name) {
            case 'title':
                if (!value || value.trim().length < 3)
                    return 'Titel muss mindestens 3 Zeichen lang sein.';
                if (value.length > 100)
                    return 'Titel darf maximal 100 Zeichen lang sein.';
                break;
            case 'description':
                if (value && value.length > 500)
                    return 'Beschreibung darf maximal 500 Zeichen lang sein.';
                break;
            case 'release_year':
                if (!/^\d{4}$/.test(value))
                    return 'Bitte ein gültiges Jahr (z. B. 2023) angeben.';
                break;
            case 'rental_duration':
                if (!value || isNaN(value))
                    return 'Bitte eine gültige Ausleihdauer angeben.';
                break;
            case 'rental_rate':
                if (!/^\d+(\.\d{1,2})?$/.test(value))
                    return 'Bitte eine gültige Ausleihgebühr angeben.';
                break;
            case 'length':
                if (!value || isNaN(value))
                    return 'Bitte eine gültige Länge angeben.';
                break;
            case 'replacement_cost':
                if (!/^\d+(\.\d{1,2})?$/.test(value))
                    return 'Bitte gültige Ersatzkosten angeben.';
                break;
            case 'special_features':
                if (value && value.length > 200)
                    return 'Maximal 200 Zeichen erlaubt.';
                break;
        }
        return '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (!film) return;
        setFilm({ ...film, [name]: value });
        setErrors({ ...errors, [name]: validateField(name, value) });
    };

    const validateAll = (): boolean => {
        if (!film) return false;
        const newErrors: ValidationError = {};
        Object.entries(film).forEach(([key, value]) => {
            const err = validateField(key, value);
            if (err) newErrors[key as keyof Film] = err;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateAll()) {
            alert('Bitte korrigieren Sie die Eingaben.');
            return;
        }

        if (film && id) {
            const updatedCount = await updateFilm(id, film);
            if (updatedCount) {
                alert('Film erfolgreich aktualisiert.');
                navigate('/film');
            } else {
                alert('Fehler beim Aktualisieren.');
            }
        }
    };

    const handleDeleteConfirm = async () => {
        setDeleteConfirmOpen(false);
        if (id) {
            const success = await deleteFilm(id);
            if (success) {
                setDeleteSuccessOpen(true);
                setTimeout(() => navigate('/film'), 2000);
            }
        }
    };

    if (isLoading) return <Typography>Lädt...</Typography>;
    if (!film) return <Typography>Film nicht gefunden.</Typography>;

    return (
        <div>
            <Typography variant="h4" gutterBottom>Film bearbeiten</Typography>
            <Stack spacing={2}>
                {[
                    { label: 'Titel', name: 'title', required: true },
                    { label: 'Beschreibung', name: 'description', multiline: true, rows: 4 },
                    { label: 'Erscheinungsjahr', name: 'release_year' },
                    { label: 'Ausleihdauer', name: 'rental_duration' },
                    { label: 'Ausleihgebühr', name: 'rental_rate' },
                    { label: 'Länge (Minuten)', name: 'length' },
                    { label: 'Ersatzkosten', name: 'replacement_cost' },
                    { label: 'Besondere Features', name: 'special_features' },
                ].map(({ label, name, ...rest }) => (
                    <TextField
                        key={name}
                        label={label}
                        name={name}
                        value={(film as any)[name] || ''}
                        onChange={handleChange}
                        error={Boolean(errors[name as keyof Film])}
                        helperText={errors[name as keyof Film]}
                        fullWidth
                        {...rest}
                    />
                ))}

                <TextField
                    select
                    label="Bewertung"
                    name="rating"
                    value={film.rating || ''}
                    onChange={handleChange}
                    fullWidth
                >
                    {Object.values(FilmRating).map((rating) => (
                        <MenuItem key={rating} value={rating}>{rating}</MenuItem>
                    ))}
                </TextField>

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
                    <Button variant="contained" color="primary" onClick={handleSave}>Speichern</Button>
                    <Button variant="outlined" color="secondary" onClick={() => navigate('/film')}>Zurück</Button>
                    <Button variant="contained" color="error" onClick={() => setDeleteConfirmOpen(true)}>Löschen</Button>
                </Stack>
            </Stack>

            {/* Löschen Bestätigung */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Löschen bestätigen</DialogTitle>
                <DialogContent>
                    <DialogContentText>Wollen Sie diesen Film wirklich löschen?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)} color="secondary">Abbrechen</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Löschen</Button>
                </DialogActions>
            </Dialog>

            {/* Erfolgsdialog */}
            <Dialog open={deleteSuccessOpen} onClose={() => setDeleteSuccessOpen(false)}>
                <DialogTitle>Film gelöscht</DialogTitle>
                <DialogContent>
                    <DialogContentText>Der Film wurde erfolgreich gelöscht.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => navigate('/film')} color="primary">Zurück zur Übersicht</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default FilmFormular;
