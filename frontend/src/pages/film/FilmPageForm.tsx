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
import {addActorToFilm, createFilm, getFilmById, removeActorFromFilm, updateFilm} from "../../service/FilmService";
import {useEffect, useState} from "react";
import {createActor} from "../../service/ActorService.ts";

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
    actors: { first_name: string; last_name: string }[];
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
    actors: []
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
    length: {
        validation: {
            required: true,
            minLength: 1,
            maxLength: 5,
            pattern: /^\d+$/
        },
        message: "Länge ist erforderlich und muss eine Zahl sein.",
        valid: true
    }
};

const FilmPageForm = () => {
    const { id } = useParams();
    const isEditMode = !!id; // prüfen ob edit oder neu
    const navigate = useNavigate();
    const [input, setInput] = useState<FilmInputType>({ ...defaultInput });
    const [validation, setValidation] = useState<ValidationFieldset>({ ...defaultValidation });
    const [newActorInputs, setNewActorInputs] = useState([{ first_name: "", last_name: "" }]);

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
     * Fügt ein neues Schauspieler-Eingabefeld max. 5 hinzu.
     */
    function handleAddActorInput(): void {
        if (newActorInputs.length < 5) {
            setNewActorInputs([...newActorInputs, { first_name: "", last_name: "" }]);
        }
    }

    /**
     * Aktualisiert Vorname oder Nachname eines neuen Schauspielers.
     * @param {number} index - Die Position in der Liste
     * @param {"first_name" | "last_name"} field - Welches Feld verändert wird
     * @param {string} value - Der neue Textwert
     */
    function handleActorInputChange(index: number, field: "first_name" | "last_name", value: string): void {
        const updated = [...newActorInputs];
        updated[index][field] = value;
        setNewActorInputs(updated);
    }

    /**
     * Entfernt einen bestehenden Schauspieler aus der Schauspieler-Liste.
     * @param {number} actor_id - Die ID des zu entfernenden Schauspielers
     */
    async function handleRemoveActor(actor_id: number): Promise<void> {
        if (!id) return;

        const confirmed = window.confirm("Schauspieler wirklich entfernen?");
        if (!confirmed) return;

        const success = await removeActorFromFilm(parseInt(id), actor_id);
        if (success) {
            const updated = await getFilmById(id);
            setInput({
                ...updated,
                release_year: String(updated.release_year),
                length: String(updated.length),
                rental_rate: String(updated.rental_rate),
                rental_duration: String(updated.rental_duration),
                replacement_cost: String(updated.replacement_cost),
                language_id: String(updated.language_id),
                actors: updated.actors || []
            });
        } else {
            alert("Entfernen fehlgeschlagen.");
        }
    }



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

        const validActors = newActorInputs.filter(a => a.first_name.trim() && a.last_name.trim());

        const fullInput = {
            ...input,
            actors: [
                ...input.actors.filter((a: any) => a.actor_id),
                ...validActors
            ]
        };

        delete fullInput.film_id;

        const success = id
            ? await updateFilm(id, fullInput)
            : await createFilm(fullInput);

        if (success && id) {
            for (const actor of validActors) {
                const actorCreated = await createActor(actor);
                if (actorCreated && typeof actorCreated === "number") {
                    await addActorToFilm(parseInt(id), actorCreated);
                }
            }
        }

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
                        <FormControl fullWidth>
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
                        </FormControl>

                        <TextField
                            label="Rental Rate"
                            type="number"
                            value={input.rental_rate}
                            onChange={(e) => handleInputChanged("rental_rate", e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Rental Duration (Tage)"
                            type="number"
                            value={input.rental_duration}
                            onChange={(e) => handleInputChanged("rental_duration", e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Replacement Cost"
                            type="number"
                            value={input.replacement_cost}
                            onChange={(e) => handleInputChanged("replacement_cost", e.target.value)}
                            fullWidth
                        />
                        <FormControl fullWidth>
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
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Schauspieler im Film
                    </Typography>

                    {/* neue schauspieler eingabe */}
                    <Stack spacing={2} mb={3}>
                        {newActorInputs.map((actor, index) => (
                            <Stack direction="row" spacing={1} key={index}>
                                <TextField
                                    label="Vorname"
                                    value={actor.first_name}
                                    onChange={(e) => handleActorInputChange(index, "first_name", e.target.value)}
                                    fullWidth
                                />
                                <TextField
                                    label="Nachname"
                                    value={actor.last_name}
                                    onChange={(e) => handleActorInputChange(index, "last_name", e.target.value)}
                                    fullWidth
                                />
                            </Stack>
                        ))}
                        <Button
                            variant="outlined"
                            onClick={handleAddActorInput}
                            disabled={newActorInputs.length >= 5}>+ Schauspieler</Button>
                    </Stack>

                    {/* bestehende schauspieler anzeigen */}
                    <Stack spacing={1}>
                        {input.actors && input.actors.length > 0 ? (
                            input.actors.map((actor: any) => (
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
                            <Typography color="text.secondary">Noch keine Schauspieler hinzugefügt</Typography>
                        )}
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};

export default FilmPageForm;
