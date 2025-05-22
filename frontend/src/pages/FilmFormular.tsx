// frontend/src/pages/FilmFormular.tsx

import React, { useEffect, useState } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    Stack,
    TextField,
    MenuItem,
    Button,
    Typography,
    SelectChangeEvent,       // ← neu
} from '@mui/material';
import JsonView from '@uiw/react-json-view';
import { useParams, useNavigate } from 'react-router-dom';
import { Film, FilmRating, Category } from '../types/types';       // ← Category import
import { getFilmById, createFilm, updateFilm } from '../service/FilmService';
import { getAllCategories } from '../service/CategoryService';     // ← Service für Kategorien

export type ValidationFieldset = {
    [key in keyof Partial<Film>]: {
        validation?: {
            required?: boolean;
            minLength?: number;
            maxLength?: number;
            pattern?: RegExp;
        };
        message?: string;
        valid: boolean;
    };
};

// Default-Werte für neue Filme
const defaultInput: Film = {
    title: '',
    description: '',
    release_year: '',
    rental_duration: '',
    rental_rate: '0.99',
    length: 0,
    replacement_cost: '20',
    rating: FilmRating.G,
    special_features: ''
};

// Default-Validation (unverändert)
const defaultValidation: ValidationFieldset = {
    /* … wie gehabt … */
};

const FilmFormular: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [input, setInput] = useState<Film>(defaultInput);
    const [validation, setValidation] = useState<ValidationFieldset>(defaultValidation);

    // === NEUE STATES FÜR KATEGORIEN ===
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    // Bei Edit-Modus Film und Kategorien laden
    useEffect(() => {
        // Kategorien laden
            getAllCategories().then((cats: Category[] | undefined) => {
            if (cats) setAllCategories(cats);
            });

        if (id) {
            getFilmById(id).then(film => {
                if (film) {
                    setInput(film);
                    // falls film.categories mitkommt
                    if (film.categories) {
                        setSelectedCategories(film.categories.map(c => c.category_id));
                    }
                }
            });
        }
    }, [id]);

    // Eingabe-Handler (unverändert)
    const handleInputChanged = (key: keyof Film, value: unknown) => {
        setInput(prev => ({ ...prev, [key]: value }));
    };

    // Validation-Funktion (unverändert)
    const validateForm = (): boolean => {
        /* … wie gehabt … */
        return true; // placeholder
    };

    // Save-Handler: Create/Update + Kategorien speichern
    const handleSaveClicked = async () => {
        if (!validateForm()) return;

        const payload = { ...input, length: Number(input.length) };

        let filmId: number | undefined;
        if (id) {
            const count = await updateFilm(id, payload);
            if (count) {
                alert(`Film ${id} aktualisiert (${count}).`);
                filmId = Number(id);
            }
        } else {
            const newId = await createFilm(payload as Film);
            if (newId) {
                alert(`Film angelegt mit ID ${newId}.`);
                filmId = newId;
            }
        }

        if (filmId) {
            // alte Zuordnungen löschen
            await Promise.all(
                allCategories.map(cat =>
                    fetch(
                        `http://localhost:3000/film/${filmId}/category/${cat.category_id}`,
                        { method: 'DELETE' }
                    )
                )
            );
            // neue Zuordnungen anlegen
            await Promise.all(
                selectedCategories.map(catId =>
                    fetch(
                        `http://localhost:3000/film/${filmId}/category/${catId}`,
                        { method: 'POST' }
                    )
                )
            );
        }

        setValidation(defaultValidation);
        navigate('/film');
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                {id ? `Film bearbeiten (ID ${id})` : 'Neuen Film anlegen'}
            </Typography>

            <Stack spacing={2} direction="row" alignItems="flex-start">
                <Stack spacing={2}>
                    {/* … deine TextFields wie Titel, Beschreibung etc. … */}
                    <TextField
                        label="Titel"
                        variant="standard"
                        value={input.title}
                        onChange={e => handleInputChanged('title', e.target.value)}
                    />
                    {/* … weitere Felder … */}

                    {/* === NEUES MULTI-SELECT FÜR KATEGORIEN === */}
                    <FormControl variant="standard" fullWidth>
                        <InputLabel id="cat-multi-label">Kategorien</InputLabel>
                        <Select
                            labelId="cat-multi-label"
                            multiple
                            value={selectedCategories}
                            onChange={(e: SelectChangeEvent<number[]>) =>
                                setSelectedCategories(e.target.value as number[])
                            }
                            renderValue={vals =>
                                allCategories
                                    .filter(c => vals.includes(c.category_id))
                                    .map(c => c.name)
                                    .join(', ')
                            }
                        >
                            {allCategories.map(cat => (
                                <MenuItem key={cat.category_id} value={cat.category_id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Save / Cancel */}
                    <Stack direction="row" spacing={2} pt={2}>
                        <Button variant="contained" onClick={handleSaveClicked}>
                            Save
                        </Button>
                        <Button variant="outlined" onClick={() => navigate('/film')}>
                            Cancel
                        </Button>
                    </Stack>
                </Stack>

                {/* Debug: Input & Validation */}
                <Typography variant="subtitle2">Input</Typography>
                <JsonView value={input} collapsed />
                <Typography variant="subtitle2">Validation</Typography>
                <JsonView value={validation} collapsed />
            </Stack>
        </div>
    );
};

export default FilmFormular;
