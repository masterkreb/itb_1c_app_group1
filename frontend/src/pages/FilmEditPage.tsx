// src/pages/film/FilmEditPage.tsx
// noinspection JSUnusedLocalSymbols

import React, { useEffect, useState } from "react";
import {
    FormControl,
    InputLabel,
    Select,
    Stack,
    TextField,
    MenuItem,
    Button,
    Typography
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import JsonView from "@uiw/react-json-view";

import {
    getFilmById,
    createFilm,
    updateFilm
} from "../service/FilmService.ts";
import { Film, FilmInput } from "../types/types.ts";

export enum FilmRating {
    G = "G",
    PG = "PG",
    PG13 = "PG-13",
    R = "R",
    NC17 = "NC-17"
}

export interface InputType {
    film_id?: number;             // fällt weg im Create-Modus
    title: string;
    length: string;               // als String im Formular; wird später in Number konvertiert
    description: string;
    release_year: number;
    language_id: number;
    rental_duration: number;
    rental_rate: number;
    replacement_cost: number;
    special_features: string;
    rating: FilmRating | "";
}

export type ValidationFieldset = {
    [key in keyof Partial<InputType>]: {
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

const defaultInput: InputType = {
    film_id: undefined,
    title: "",
    length: "0",
    description: "",
    release_year: new Date().getFullYear(),
    language_id: 1,
    rental_duration: 0,
    rental_rate: 0,
    replacement_cost: 0,
    rating: "",
    special_features: ""
};

const defaultValidation: ValidationFieldset = {
    title: {
        validation: {
            required: true,
            minLength: 3,
            maxLength: 100,
            pattern: /^[a-zA-Z0-9\s]+$/
        },
        message: "",
        valid: true
    },
    length: {
        validation: {
            required: true,
            minLength: 1,
            maxLength: 3
        },
        message: "",
        valid: true
    },
    rating: {
        validation: {
            required: false
        },
        message: "",
        valid: true
    },
    language_id: {
        validation: {
            required: true,
            minLength: 1
        },
        message: "",
        valid: true
    }
};

/**
 * FilmEditPage - Komponente zur Erstellung und Bearbeitung von Filmen
 *
 * Diese Komponente stellt ein Formular bereit, mit dem neue Filme angelegt oder
 * bestehende Filme bearbeitet werden können. Sie unterstützt Validierung und
 * kommuniziert mit dem Backend-Server über die FilmService-Funktionen.
 *
 * @example
 * // Film erstellen
 * <FilmEditPage />
 *
 * // Film mit ID 123 bearbeiten
 * <FilmEditPage filmId="123" />
 *
 * @returns {JSX.Element} Die gerenderte Film-Bearbeitungsseite
 */
const FilmEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { filmId } = useParams<{ filmId: string }>();

    const [input, setInput] = useState<InputType>({ ...defaultInput });
    const [validation, setValidation] = useState<ValidationFieldset>({
        ...defaultValidation
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Wenn filmId gesetzt ist, lade vorhandene Daten (Edit-Modus)
    useEffect(() => {
        if (filmId) {
            (async () => {
                setLoading(true);
                setError(null);

                try {
                    const parsedId = parseInt(filmId, 10);
                    const filmData: Film = await getFilmById(parsedId);
                    setInput({
                        film_id: filmData.film_id,
                        title: filmData.title,
                        // Sicherstellen, dass optionale Werte mit Fallbacks behandelt werden
                        length: filmData.length?.toString() || "0",
                        description: filmData.description || "",
                        release_year: filmData.release_year || new Date().getFullYear(),
                        language_id: filmData.language_id,
                        rental_duration: filmData.rental_duration,
                        rental_rate: filmData.rental_rate,
                        replacement_cost: filmData.replacement_cost,
                        rating: (filmData.rating as FilmRating) || "",
                        special_features: filmData.special_features || ""
                    });
                } catch (err) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Fehler beim Laden der Filmdaten."
                    );
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [filmId]);

    /**
     * Aktualisiert einen spezifischen Wert im Eingabe-State
     *
     * @param {keyof InputType} key - Der Schlüssel des zu aktualisierenden Werts
     * @param {unknown} value - Der neue Wert
     */
    function handleInputChanged(key: keyof InputType, value: unknown) {
        setInput((prev) => ({
            ...prev,
            [key]: value
        }));
    }

    /**
     * Validiert das Formular anhand defaultValidation.
     * @returns {boolean} true, wenn gültig, sonst false.
     */
    function validateForm(): boolean {
        let formIsValid = true;
        const newValidation: ValidationFieldset = { ...validation };

        Object.entries(input).forEach(([fieldKey, rawValue]) => {
            const key = fieldKey as keyof InputType;
            const rules = newValidation[key];
            const val = rawValue as string | number;

            if (rules?.validation) {
                // Required prüfen
                if (
                    rules.validation.required &&
                    (val === "" || val === 0 || val === undefined)
                ) {
                    rules.valid = false;
                    rules.message = "Bitte einen Wert angeben.";
                    formIsValid = false;
                    return;
                }
                // MinLength prüfen (nur für string)
                if (
                    rules.validation.minLength &&
                    typeof val === "string" &&
                    val.length < rules.validation.minLength
                ) {
                    rules.valid = false;
                    rules.message = `Mindestens ${rules.validation.minLength} Zeichen.`;
                    formIsValid = false;
                    return;
                }
                // MaxLength prüfen (nur für string)
                if (
                    rules.validation.maxLength &&
                    typeof val === "string" &&
                    val.length > rules.validation.maxLength
                ) {
                    rules.valid = false;
                    rules.message = `Maximal ${rules.validation.maxLength} Zeichen.`;
                    formIsValid = false;
                    return;
                }
                // Pattern prüfen (nur für string)
                if (
                    rules.validation.pattern &&
                    typeof val === "string" &&
                    !rules.validation.pattern.test(val)
                ) {
                    rules.valid = false;
                    rules.message = "Ungültiges Format.";
                    formIsValid = false;
                    return;
                }

                // Wenn alles ok
                rules.valid = true;
                rules.message = "";
            }
        });

        setValidation(newValidation);
        return formIsValid;
    }

    /**
     * Speichert das Formular: Create oder Update.
     *
     * @async
     * @function handleSaveClicked
     * @example
     * await handleSaveClicked();
     *
     * @returns {Promise<void>}
     */
    async function handleSaveClicked(): Promise<void> {
        if (!validateForm()) {
            console.log("Validation failed");
            return;
        }

        setError(null);
        setLoading(true);

        // FilmInput (ohne film_id) bauen
        const payload: FilmInput = {
            title: input.title,
            length: Number(input.length),
            description: input.description,
            release_year: input.release_year,
            language_id: input.language_id,
            rental_duration: input.rental_duration,
            rental_rate: input.rental_rate,
            replacement_cost: input.replacement_cost,
            rating: input.rating || "",
            special_features: input.special_features
        };

        try {
            if (filmId) {
                // Edit-Modus
                await updateFilm(Number(filmId), payload);
            } else {
                // Create-Modus
                await createFilm(payload);
            }
            // Nach Speichern zurück zur Listen-Seite
            navigate("/film");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Fehler beim Speichern des Films."
            );
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <Typography>Lädt…</Typography>;
    }

    if (error) {
        return (
            <Typography color="error" variant="body1">
                {error}
            </Typography>
        );
    }

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                {filmId ? `Film bearbeiten (ID: ${filmId})` : "Neuen Film anlegen"}
            </Typography>

            <Stack spacing={2} direction="column" sx={{ maxWidth: 600 }}>
                <TextField
                    required
                    label="Titel"
                    variant="standard"
                    value={input.title}
                    onChange={(e) => handleInputChanged("title", e.target.value)}
                    error={validation.title?.valid === false}
                    helperText={validation.title?.message}
                />

                <TextField
                    required
                    label="Länge (in Minuten)"
                    variant="standard"
                    type="number"
                    value={input.length}
                    onChange={(e) =>
                        handleInputChanged("length", e.target.value)
                    }
                    error={validation.length?.valid === false}
                    helperText={validation.length?.message}
                />

                <TextField
                    label="Beschreibung"
                    variant="standard"
                    multiline
                    value={input.description}
                    onChange={(e) =>
                        handleInputChanged("description", e.target.value)
                    }
                />

                <TextField
                    label="Erscheinungsjahr"
                    variant="standard"
                    type="number"
                    value={input.release_year}
                    onChange={(e) =>
                        handleInputChanged(
                            "release_year",
                            Number(e.target.value)
                        )
                    }
                />

                <TextField
                    label="Language ID"
                    variant="standard"
                    type="number"
                    value={input.language_id}
                    onChange={(e) =>
                        handleInputChanged(
                            "language_id",
                            Number(e.target.value)
                        )
                    }
                />

                <TextField
                    label="Mietdauer (Tage)"
                    variant="standard"
                    type="number"
                    value={input.rental_duration}
                    onChange={(e) =>
                        handleInputChanged(
                            "rental_duration",
                            Number(e.target.value)
                        )
                    }
                />

                <TextField
                    label="Mietrate"
                    variant="standard"
                    type="number"
                    value={input.rental_rate}
                    onChange={(e) =>
                        handleInputChanged("rental_rate", Number(e.target.value))
                    }
                />

                <TextField
                    label="Wiederbeschaffungskosten"
                    variant="standard"
                    type="number"
                    value={input.replacement_cost}
                    onChange={(e) =>
                        handleInputChanged(
                            "replacement_cost",
                            Number(e.target.value)
                        )
                    }
                />

                <FormControl fullWidth>
                    <InputLabel id="rating-select-label">Rating</InputLabel>
                    <Select
                        labelId="rating-select-label"
                        id="rating-select"
                        value={input.rating}
                        label="Rating"
                        onChange={(e) =>
                            handleInputChanged("rating", e.target.value as FilmRating)
                        }
                    >
                        <MenuItem value="">None</MenuItem>
                        {Object.values(FilmRating).map((rating) => (
                            <MenuItem key={rating} value={rating}>
                                {rating}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Aussergewöhnliche Merkmale"
                    variant="standard"
                    value={input.special_features}
                    onChange={(e) =>
                        handleInputChanged("special_features", e.target.value)
                    }
                />

                <Button
                    variant="contained"
                    onClick={handleSaveClicked}
                    disabled={loading}
                >
                    {filmId ? "Änderungen speichern" : "Film anlegen"}
                </Button>

                {/* Debug-Ansicht: Input- und Validation-Objekt */}
                <JsonView value={input} />
                <JsonView value={validation} />
            </Stack>
        </div>
    );
};

export default FilmEditPage;