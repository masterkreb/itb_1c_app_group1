// noinspection JSUnusedLocalSymbols
import { useNavigate, useParams } from "react-router";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {createFilm, getFilmById, updateFilm} from "../../service/FilmService";
import {useEffect, useState} from "react";


// Typdefinition für Film-Input
export interface FilmInputType {
    film_id?: string;
    title: string;
    description: string;
    release_year: string;
    length: string;
    rating?: string;
    rental_rate?: string;
    rental_duration?: string;
    replacement_cost?: string;
    language_id?: string;
}

// Validierungsstruktur für Eingabefelder
export type ValidationFieldset = {
    [key in keyof Partial<FilmInputType>]: {
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

// initiale Datenstruktur für den Film
const defaultInput: FilmInputType = {
    film_id: "",
    title: "",
    description: "",
    release_year: "",
    length: "",
    rating: "",
    rental_rate: "",
    rental_duration: "",
    replacement_cost: "",
    language_id: "",
};

// Validierungsregeln nur für Pflichtfelder
const defaultValidation: ValidationFieldset = {
    title: {
        validation: {
            required: true,
            minLength: 1,
            maxLength: 100
        },
        message: "Titel ist erforderlich",
        valid: true
    },
    description: {
        validation: {
            required: true,
            minLength: 2,
            maxLength: 500
        },
        message: "Beschreibung ist erforderlich",
        valid: true
    },
    release_year: {
        validation: {
            required: true
        },
        message: "Jahr ist erforderlich",
        valid: true
    },
    length: {
        validation: {
            required: true,
            minLength: 1,
            maxLength: 5,
            pattern: /^\d+$/
        },
        message: "Länge ist erforderlich und muss eine Zahl sein.",
        valid: true
    },
    rating: {
        validation: {
            required: true
        },
        message: "Rating ist erforderlich",
        valid: true
    },
    rental_rate: {
        validation: {
            required: true
        },
        message: "Rental Rate ist erforderlich",
        valid: true
    },
    rental_duration: {
        validation: {
            required: true
        },
        message: "Rental Duration ist erforderlich",
        valid: true
    },
    replacement_cost: {
        validation: {
            required: true
        },
        message: "Replacement Cost ist erforderlich",
        valid: true
    },
    language_id: {
        validation: {
            required: true
        },
        message: "Sprache ist erforderlich",
        valid: true
    }
};

/**
 * Diese Komponente zeigt ein Formular zum Erstellen oder Bearbeiten eines Films.
 *
 * @returns:
 * - Eingabefelder für Film-Informationen (z. B. Titel, Beschreibung, Länge, Rating usw.)
 * - Eingabefelder für neue Schauspieler
 * - Button zum Speichern
 *
 * State Variablen:
 * - `input`: Hält die Formulardaten für den Film
 * - `validation`: Validierungsstatus für Pflichtfelder
 * - `newActorInputs`: Neue Schauspieler zum Hinzufügen
 */

const FilmPageForm = () => {
    const { id } = useParams();
    const isEditMode = !!id; // prüfen ob edit oder neu
    const navigate = useNavigate();
    const [input, setInput] = useState<FilmInputType>({ ...defaultInput });
    const [validation, setValidation] = useState<ValidationFieldset>({ ...defaultValidation });


    useEffect(() => {
        console.log("Film Page mounted");
        if (id) {
            getFilmById(id).then((data) => {
                if (data) {
                    setInput({
                        ...data,
                        release_year: String(data.release_year),
                        length: String(data.length),
                        rental_rate: String(data.rental_rate),
                        rental_duration: String(data.rental_duration),
                        replacement_cost: String(data.replacement_cost),
                        language_id: String(data.language_id),
                        rating: data.rating || "",
                        special_features: data.special_features || "",
                        actors: data.actors || []
                    });
                    setValidation(defaultValidation);
                }
            });
        } else {
            setInput({ ...defaultInput }); // leeren Zustand für "neu"
            setValidation(defaultValidation);
        }
    }, [id]);

    /**
     * Aktualisiert ein Eingabefeld im Filmformular.
     * @param {keyof FilmInputType} key - Der Feldname (z. B. "title")
     * @param {unknown} value - Der neue Wert
     */
    function handleInputChanged(key: keyof FilmInputType, value: unknown): void {
        setInput({
            ...input,
            [key]: value
        });
    }



    /**
     * Aktualisiert Vorname oder Nachname eines neuen Schauspielers.
     * @param {number} index - Die Position in der Liste
     * @param {"first_name" | "last_name"} field - Welches Feld verändert wird
     * @param {string} value - Der neue Textwert
     */


    /**
     * Entfernt einen bestehenden Schauspieler aus der Schauspieler-Liste.
     * @param {number} actor_id - Die ID des zu entfernenden Schauspielers
     */




    /**
     * Validiert das Formular anhand der Validierungsregeln in `defaultValidation`.
     * Es überprüft jeden Wert (z. B. Titel, Beschreibung, Länge) und aktualisiert
     * die `validation`-State mit Fehlermeldungen, falls notwendig.
     *
     * @returns {boolean} true wenn alle Pflichtfelder gültig sind, sonst false.
     */
    function validateForm(): boolean {
        let formIsValid = true;

        Object.entries(input).forEach(([key, value]) => {
            const keyField = key as keyof FilmInputType;
            const validationOptions: ValidationFieldset[keyof FilmInputType] = validation[keyField];

            if (validationOptions?.validation) {
                if (validationOptions.validation.required && !value) {
                    validationOptions.valid = false;
                    validationOptions.message = "Bitte einen Wert angeben.";
                    formIsValid = false;
                } else if (
                    validationOptions.validation.minLength &&
                    value &&
                    (value as string).length < validationOptions.validation.minLength
                ) {
                    validationOptions.valid = false;
                    validationOptions.message = `Bitte einen Wert mit mindestens ${validationOptions.validation.minLength} Zeichen angeben.`;
                    formIsValid = false;
                } else if (
                    validationOptions.validation.maxLength &&
                    value &&
                    (value as string).length > validationOptions.validation.maxLength
                ) {
                    validationOptions.valid = false;
                    validationOptions.message = `Bitte einen Wert mit maximal ${validationOptions.validation.maxLength} Zeichen angeben.`;
                    formIsValid = false;
                } else if (
                    validationOptions.validation.pattern &&
                    value &&
                    !validationOptions.validation.pattern.test(value as string)
                ) {
                    validationOptions.valid = false;
                    validationOptions.message = `Bitte einen Wert mit dem Muster ${validationOptions.validation.pattern} angeben.`;
                    formIsValid = false;
                } else {
                    validationOptions.valid = true;
                    validationOptions.message = "";
                }
            }

            setValidation((prevState) => ({
                ...prevState,
                [keyField]: {
                    ...validationOptions,
                    message: validationOptions?.message ?? "",
                    valid: validationOptions?.valid ?? false,
                }
            }));
        });

        return formIsValid;
    }


    /**
     * Speichert den Film (neu oder bearbeitet).
     * Führt vorher die Validierung durch und kombiniert alte + neue Schauspieler.
     *
     * @returns {Promise<void>}
     */
    async function handleSaveClicked(): Promise<void> {
        if (!validateForm()) return;



        const sanitizedInput = Object.fromEntries(
            Object.entries(input).map(([key, val]) => [key, val === "" ? undefined : val])
        );


        delete sanitizedInput.film_id;
        console.log("GÖNDERİLEN VERİ:", sanitizedInput);


        const success = id
            ? await updateFilm(id, sanitizedInput)
            : await createFilm(sanitizedInput);




        if (success) {
            setValidation(defaultValidation);
            navigate("/film");
        } else {
            alert("Fehler beim Speichern.");
        }
    }




    return (
        <Box sx={{ my: 4 }}>
            <Stack direction="row" spacing={4} alignItems="flex-start">
                {/* Felder linke seite */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" gutterBottom>
                        {isEditMode ? "Film bearbeiten" : "Neuer Film"}
                    </Typography>

                    <Stack spacing={2}>
                        <TextField
                            label="Titel *"
                            value={input.title}
                            onChange={(e) => handleInputChanged("title", e.target.value)}
                            error={!validation.title?.valid}
                            helperText={!validation.title?.valid ? validation.title?.message : ""}
                            fullWidth
                        />
                        <TextField
                            label="Beschreibung *"
                            value={input.description}
                            onChange={(e) => handleInputChanged("description", e.target.value)}
                            error={!validation.description?.valid}
                            helperText={!validation.description?.valid ? validation.description?.message : ""}
                            fullWidth
                            multiline
                            rows={3}
                        />
                        <TextField
                            label="Jahr"
                            type="number"
                            value={input.release_year}
                            onChange={(e) => handleInputChanged("release_year", e.target.value)}
                            error={!validation.release_year?.valid}
                            helperText={!validation.release_year?.valid ? validation.release_year?.message : ""}
                            fullWidth
                        />

                        <TextField
                            label="Länge (Minuten) *"
                            type="number"
                            value={input.length}
                            onChange={(e) => handleInputChanged("length", e.target.value)}
                            error={!validation.length?.valid}
                            helperText={!validation.length?.valid ? validation.length?.message : ""}
                            fullWidth
                        />
                        <FormControl fullWidth error={!validation.rating?.valid}>
                            <InputLabel id="rating-label">Rating</InputLabel>
                            <Select
                                labelId="rating-label"
                                value={input.rating}
                                label="Rating"
                                onChange={(e) => handleInputChanged("rating", e.target.value)}
                            >
                                <MenuItem value=""><em>Kein Rating</em></MenuItem>
                                <MenuItem value="G">G</MenuItem>
                                <MenuItem value="PG">PG</MenuItem>
                                <MenuItem value="PG-13">PG-13</MenuItem>
                                <MenuItem value="R">R</MenuItem>
                                <MenuItem value="NC-17">NC-17</MenuItem>
                            </Select>
                            {!validation.rating?.valid && (
                                <Typography variant="caption" color="error">
                                    {validation.rating?.message}
                                </Typography>
                            )}
                        </FormControl>


                        <TextField
                            label="Rental Rate"
                            type="number"
                            value={input.rental_rate}
                            onChange={(e) => handleInputChanged("rental_rate", e.target.value)}
                            error={!validation.rental_rate?.valid}
                            helperText={!validation.rental_rate?.valid ? validation.rental_rate?.message : ""}
                            fullWidth
                        />

                        <TextField
                            label="Rental Duration (Tage)"
                            type="number"
                            value={input.rental_duration}
                            onChange={(e) => handleInputChanged("rental_duration", e.target.value)}
                            error={!validation.rental_duration?.valid}
                            helperText={!validation.rental_duration?.valid ? validation.rental_duration?.message : ""}
                            fullWidth
                        />

                        <TextField
                            label="Replacement Cost"
                            type="number"
                            value={input.replacement_cost}
                            onChange={(e) => handleInputChanged("replacement_cost", e.target.value)}
                            error={!validation.replacement_cost?.valid}
                            helperText={!validation.replacement_cost?.valid ? validation.replacement_cost?.message : ""}
                            fullWidth
                        />

                        <FormControl fullWidth error={!validation.language_id?.valid}>
                            <InputLabel id="language-label">Sprache</InputLabel>
                            <Select
                                labelId="language-label"
                                value={input.language_id}
                                label="Sprache"
                                onChange={(e) => handleInputChanged("language_id", e.target.value)}
                            >
                                <MenuItem value=""><em>Keine Sprache</em></MenuItem>
                                <MenuItem value="1">Englisch</MenuItem>
                                <MenuItem value="2">Italienisch</MenuItem>
                                <MenuItem value="3">Japanisch</MenuItem>
                                <MenuItem value="4">Mandarin</MenuItem>
                                <MenuItem value="5">Französisch</MenuItem>
                                <MenuItem value="6">Deutsch</MenuItem>
                            </Select>
                            {!validation.language_id?.valid && (
                                <Typography variant="caption" color="error">
                                    {validation.language_id?.message}
                                </Typography>
                            )}
                        </FormControl>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSaveClicked}
                        >
                            Speichern
                        </Button>
                    </Stack>
                </Box>

                {/* Felder rechte seite */}

            </Stack>
        </Box>
    );
};

export default FilmPageForm;
