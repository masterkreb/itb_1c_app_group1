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
export interface FilmInputTypeCreate {
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

export interface FilmInputTypeEdit extends FilmInputTypeCreate {
    actors: { actor_id: number; first_name: string; last_name: string }[];
}


// Validierungsstruktur für Eingabefelder
export type ValidationFieldset = {
    [key in keyof Partial<FilmInputTypeCreate>]: {
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
const defaultInput: FilmInputTypeCreate = {
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
            required: false
        },
        message: "Rating ist erforderlich",
        valid: true
    },
    rental_rate: {
        validation: {
            required: false
        },
        message: "Rental Rate ist erforderlich",
        valid: true
    },
    rental_duration: {
        validation: {
            required: false
        },
        message: "Rental Duration ist erforderlich",
        valid: true
    },
    replacement_cost: {
        validation: {
            required: false
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
 * Komponente für das Erstellen und Bearbeiten eines Films sowie das Verknüpfen von Schauspielern.
 *
 * @returns Ein Formular zum Erfassen oder Bearbeiten eines Films inkl. Eingabefelder für Film-Details
 *          und Schauspieler-Management (Hinzufügen/Entfernen).
 *
 * useParams holt die ID aus der URL um Film aus dem Server zu laden.
 *
 * @state input - Enthält die aktuellen Formulardaten des Films.
 * @state validation - Validierungsstatus der Eingabefelder.
 * @state newActorInputs - Felder für neue Schauspieler.
 */
const FilmPageForm = () => {
    const { id } = useParams();
    const isEditMode = !!id; // prüfen ob edit oder neu
    const navigate = useNavigate();
    const [input, setInput] = useState<FilmInputTypeCreate | FilmInputTypeEdit>({ ...defaultInput });
    const [newActorInputs, setNewActorInputs] = useState([
        { first_name: "", last_name: "" }
    ]);


    const [validation, setValidation] = useState<ValidationFieldset>({ ...defaultValidation });

    /**
     * Wird beim Laden der Seite ausgeführt.
     * Wenn `id` vorhanden ist, wird der Film vom Server geladen und die Eingabefelder vorausgefüllt.
     * Andernfalls wird das Formular mit leeren Standardwerten initialisiert.
     */
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
                        ...(isEditMode ? { actors: data.actors || [] } : {})
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
     * Aktualisiert ein Eingabefeld im Formular.
     * @param key - Der Feldname (z.B. "title", "description")
     * @param value - Der neue Wert für das Eingabefeld
     */
    function handleInputChanged(key: keyof FilmInputTypeCreate, value: unknown): void {
        setInput({
            ...input,
            [key]: value
        });
    }

    /**
     * Fügt ein weiteres Eingabefeld für einen neuen Schauspieler hinzu.
     * Maximal 5 Eingabefelder sind erlaubt.
     */
    function handleAddActorInput(): void {
        if (newActorInputs.length < 5) {
            setNewActorInputs([...newActorInputs, { first_name: "", last_name: "" }]);
        }
    }

    /**
     * Aktualisiert den Vor- oder Nachnamen eines Schauspielers im Eingabefeld.
     * @param index - Index des Schauspielers im Eingabefeld-Array
     * @param field - Entweder "first_name" oder "last_name"
     * @param value - Der neue Wert
     */
    function handleActorInputChange(
        index: number,
        field: "first_name" | "last_name",
        value: string
    ): void {
        const updated = [...newActorInputs];
        updated[index][field] = value;
        setNewActorInputs(updated);
    }

    /**
     * Entfernt einen bestehenden Schauspieler aus dem Film.
     * Zeigt eine Bestätigung an und ruft dann den Entfernen-Service auf.
     *
     * @param actor_id - Die ID des zu entfernenden Schauspielers
     */
    async function handleRemoveActor(actor_id: number): Promise<void> {
        if (!isEditMode || !id) return;

        const confirmed = window.confirm("Schauspieler wirklich entfernen?");
        if (!confirmed) return;

        const success = await removeActorFromFilm(parseInt(id), actor_id);
        if (success) {

            setInput((prev) => {
                const currentActors = (prev as FilmInputTypeEdit).actors || [];
                const updatedActors = currentActors.filter((a) => a.actor_id !== actor_id);

                return {
                    ...prev,
                    actors: updatedActors
                } as FilmInputTypeEdit;
            });
            alert("Schauspieler wurde entfernt.");
        } else {
            alert("Fehler beim Entfernen.");
        }
    }





    /**
     * Validiert das Formular anhand der definierten Regeln für jedes Pflichtfeld.
     * Setzt für jedes Feld den Validierungsstatus und zeigt entsprechende Fehlermeldungen an.
     *
     * @returns true wenn alle Pflichtfelder gültig sind, sonst false.
     */
    function validateForm(): boolean {
        let formIsValid = true;

        Object.entries(input).forEach(([key, value]) => {
            const keyField = key as keyof FilmInputTypeCreate;
            const validationOptions: ValidationFieldset[keyof FilmInputTypeCreate] = validation[keyField];

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
     * Speichert den Film (neu oder aktualisiert) nach erfolgreicher Validierung.
     * Optional werden neue Schauspieler erstellt und mit dem Film verknüpft.
     * Bei Erfolg wird zur Filmübersicht navigiert. Bei Fehler erscheint eine Fehlermeldung.
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

        if (success && id) {
            const hasIncompleteActor = newActorInputs.some(
                (a) => (a.first_name.trim() && !a.last_name.trim()) || (!a.first_name.trim() && a.last_name.trim())
            );
            if (hasIncompleteActor) {
                alert("Bitte alle Schauspieler vollständig ausfüllen oder leer lassen.");
                return;
            }
            for (const actor of newActorInputs.filter(a => a.first_name.trim() && a.last_name.trim())) {

                const created = await createActor(actor);
                if (created && typeof created === "number") {
                    await addActorToFilm(parseInt(id), created);
                }
            }
        }

        if (success) {
            alert("Film wurde erfolgreich gespeichert.");
            setValidation(defaultValidation);
            navigate("/film");
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
                            label="Jahr *"
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
                            <InputLabel id="language-label">Sprache *</InputLabel>
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
                {isEditMode && (
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Schauspieler im Film
                        </Typography>

                        {/* neue Schauspieler eingabe */}
                        <Stack spacing={2} mb={3}>
                            {newActorInputs.map((actor, index) => (
                                <Stack direction="row" spacing={1} key={index}>
                                    <TextField
                                        label="Vorname"
                                        value={actor.first_name}
                                        onChange={(e) =>
                                            handleActorInputChange(index, "first_name", e.target.value)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="Nachname"
                                        value={actor.last_name}
                                        onChange={(e) =>
                                            handleActorInputChange(index, "last_name", e.target.value)
                                        }
                                        fullWidth
                                    />
                                </Stack>
                            ))}
                            <Button
                                variant="outlined"
                                onClick={handleAddActorInput}
                                disabled={newActorInputs.length >= 5}
                            >
                                + Schauspieler
                            </Button>
                        </Stack>

                        {/* bestehende Schauspieler anzeigen */}
                        <Stack spacing={1}>
                            {(input as FilmInputTypeEdit).actors?.length > 0 ? (
                                (input as FilmInputTypeEdit).actors.map((actor) => (
                                    <Stack
                                        key={actor.actor_id}
                                        direction="row"
                                        spacing={2}
                                        alignItems="center"
                                    >
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
                                <Typography color="text.secondary">
                                    Noch keine Schauspieler hinzugefügt
                                </Typography>
                            )}
                        </Stack>
                    </Box>
                )}

            </Stack>
        </Box>



    );
};

export default FilmPageForm;
