// noinspection JSUnusedLocalSymbols

import React, {useEffect} from 'react';
import {Stack, TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import { useParams, useNavigate } from "react-router";
import { getActorById, createActor, updateActor} from "../../service/ActorService.ts";
import { Film } from "../../types/types.ts";
import { getAllFilms, removeActorFromFilm, addActorToFilm } from "../../service/FilmService.ts";

/**
 * Datentyp für Schauspieler-Eingaben im Formular
 */
export interface InputType {
    actor_id: string;
    first_name: string;
    last_name: string;
    films?: Film[];
}

/**
 * Validierungsregeln für die Formularfelder
 */
export type ValidationFieldset = {
    [key in keyof Partial<InputType>]: {
        validation?: {
            required?: boolean,
            minLength?: number,
            maxLength?: number,
            pattern?: RegExp,
        },
        message?: string,
        valid: boolean,
    };
};

const defaultInput: InputType = {
    actor_id: "",
    first_name: "",
    last_name: ""
};

const defaultValidation: ValidationFieldset = {
    actor_id: {
        validation: {
            required: false,
            minLength: 1,
            maxLength: 20,
        },
        message: "ID muss zwischen 1 und 20 Zeichen lang sein.",
        valid: true
    },
    first_name: {
        validation: {
            required: true,
            minLength: 2,
            maxLength: 25,
            pattern: /^[a-zA-Z0-9\s]+$/
        },
        message: "Vorname muss zwischen 2 und 25 Zeichen lang sein.",
        valid: true
    },
    last_name: {
        validation: {
            required: true,
            minLength: 2,
            maxLength: 25,
            pattern: /^[a-zA-Z0-9\s]+$/,
        },
        message: "Nachname muss zwischen 2 und 25 Zeichen lang sein.",
        valid: true
    }
};


/**
 * Komponente für das Erstellen und Bearbeiten eines Schauspielers sowie das Verknüpfen von Filmen.
 * @returns Ein Formular zum Erfassen oder Bearbeiten eines Schauspielers inkl. Filmverknüpfung per Dropdown und Liste zur Entfernung verknüpfter Filme.
 * useParams holt die ID aus der URL um Schauspieler aus dem Server zu laden.
 * @state input - Enthält die aktuellen Formulardaten des Schauspielers (Vorname, Nachname, verknüpfte Filme).
 * @state validation - Speichert den Validierungsstatus und eventuelle Fehlermeldungen für jedes Eingabefeld.
 * @state allFilms - Liste aller Filme aus der Datenbank, die für eine Verknüpfung zur Auswahl stehen.
 * @state selectedFilmId - Die ID des aktuell im Dropdown ausgewählten Films, der mit dem Schauspieler verknüpft werden soll.
 */
const ActorPageForm = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const [input, setInput] = React.useState<InputType>(defaultInput)
    const [validation, setValidation] = React.useState<ValidationFieldset>(defaultValidation)
    const [allFilms, setAllFilms] = React.useState<Film[]>([]);
    const [selectedFilmId, setSelectedFilmId] = React.useState<string>("");


    useEffect(() => {
        console.log("Actor Page mounted")

        loadAllFilms();

        if (id) {
            getActorById(id).then((data) => {
                if (data) {
                    setInput(data);
                }
            });
        } else {
            setInput(defaultInput); // leeren Zustand für "neu"
        }
    }, [id]);

    /**
     * Lädt alle Filme vom Server
     */
    async function loadAllFilms() {
        const films = await getAllFilms();
        setAllFilms(films);
    }

    /**
     * Aktualisiert ein Feld im Formular
     */
    function handleInputChanged(key: keyof InputType, value: unknown) {
        setInput({
                ...input,
                [key]: value
            }
        );
    }

    /**
     * Validates the input form based on the specified validation rules for each field.
     * Updates the validation state with validation messages and status for each field.
     *
     * @return {boolean} Returns true if the form is valid, otherwise returns false.
     */
    function validateForm(): boolean {
        let formIsValid = true;

        Object.entries(input).forEach(([key, value]) => {
            const keyField = key as keyof InputType;
            const validationOptions: ValidationFieldset[keyof InputType] = validation[keyField];

            if (validationOptions?.validation) {
                if (validationOptions.validation.required && !value) {
                    validationOptions.valid = false;
                    validationOptions.message = "Bitte einen Wert angeben.";
                    formIsValid = false;
                } else if (validationOptions.validation.minLength && value && (value as string).length < validationOptions.validation.minLength) {
                    validationOptions.valid = false;
                    validationOptions.message = `Bitte einen Wert mit mindestens ${validationOptions.validation.minLength} Zeichen angeben.`;
                    formIsValid = false;
                } else if (validationOptions.validation.maxLength && value && (value as string).length > validationOptions.validation.maxLength) {
                    validationOptions.valid = false;
                    validationOptions.message = `Bitte einen Wert mit maximal ${validationOptions.validation.maxLength} Zeichen angeben.`;
                    formIsValid = false;
                } else if (validationOptions.validation.pattern && value && !(validationOptions.validation.pattern).test(value as string)) {
                    validationOptions.valid = false;
                    validationOptions.message = `Bitte einen Wert mit dem Muster ${validationOptions.validation.pattern} angeben.`;
                    formIsValid = false;
                }
                else {
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
        })

        return formIsValid;
    }

    /**
     * Speichert den Schauspieler (neu oder bearbeitet), hinter dem Speichern Button hinterlegt.
     * Bei erfolgreichem Bearbeiten/Erfassen kehrt man zur actor-Page zurück, ansonsten erscheint eine Fehlermeldung.
     */
    async function handleSaveClicked(): Promise<void> {
        console.log("Save clicked", input);

        if (!validateForm()) {
            console.log("Validation failed");
            return;
        }

        const success = id
            ? await updateActor(id, input)
            : await createActor(input);

        if (success) {
            setValidation(defaultValidation);
            navigate("/actor");
        } else {
            alert("Speichern fehlgeschlagen.");
        }
    }

    /**
     * Verknüpft einen Film mit dem Schauspieler
     */
    async function handleAddFilm() {
        if (!id || !selectedFilmId) return;

        const success = await addActorToFilm(parseInt(selectedFilmId), parseInt(id));
        if (success) {
            const film = allFilms.find(f => f.film_id === parseInt(selectedFilmId));
            if (film && !input.films?.some(f => f.film_id === film.film_id)) {
                setInput({
                    ...input,
                    films: [...(input.films || []), film],
                });
            }
            setSelectedFilmId("");
        } else {
            alert("Film konnte nicht verknüpft werden.");
        }
    }

    /**
     * Entfernt eine Filmverknüpfung vom Schauspieler
     */
    async function handleRemoveFilm(filmId: number) {
        if (!id) return;

        const confirm = window.confirm("Filmverknüpfung wirklich entfernen?");
        if (!confirm) return;

        const success = await removeActorFromFilm(filmId, parseInt(id));
        if (success) {
            setInput({
                ...input,
                films: input.films?.filter((f) => f.film_id !== filmId),
            });
        } else {
            alert("Entfernen fehlgeschlagen.");
        }
    }

    /**
     * Wird verwendet um bei neuen Schauspieler Filme zu verknüpfen.
     * Speichert den Schauspieler um eine ID zu generieren und navigiert dann zur edit-Page um Filme verknüpfen zu können.
     */
    async function handleCreateAndNavigate() {
        if (!validateForm()) {
            return;
        }

        if (!id) {
            const newActorId = await createActor(input); // gibt ID zurück

            if (newActorId) {
                navigate(`/actor/edit/${newActorId}`);
            } else {
                alert("Erstellung fehlgeschlagen.");
            }
        }
    }

    return (
        <Box sx={{ my: 4 }}>
            <Stack direction="row" spacing={4} alignItems="flex-start">
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" gutterBottom>
                        {isEditMode ? "Schauspieler bearbeiten" : "Neuer Schauspieler"}
                    </Typography>
                    <Stack spacing={2}>
                        <TextField
                            label="Vorname"
                            value={input.first_name}
                            error={!validation.first_name?.valid}
                            helperText={!validation.first_name?.valid && validation.first_name?.message}
                            onChange={(e) =>
                                handleInputChanged("first_name", e.target.value)
                            }
                        />

                        <TextField
                            label="Nachname"
                            value={input.last_name}
                            error={!validation.last_name?.valid}
                            helperText={!validation.last_name?.valid && validation.last_name?.message}
                            onChange={(e) =>
                                handleInputChanged("last_name", e.target.value)
                            }
                        />

                        <Button variant="contained" onClick={handleSaveClicked}>Speichern</Button>
                    </Stack>
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" gutterBottom>
                        Verknüpfte Filme
                    </Typography>
                    {id && (
                        <Stack spacing={2} mb={3}>
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel>Film hinzufügen</InputLabel>
                                <Select
                                    value={selectedFilmId}
                                    onChange={(e) => setSelectedFilmId(e.target.value)}
                                    label="Film hinzufügen"
                                >
                                    {allFilms.map((film) => (
                                        <MenuItem key={film.film_id ?? 'undefined'} value={film.film_id?.toString() ?? 'undefined'}>
                                            {film.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button
                                variant="outlined"
                                onClick={handleAddFilm}
                                disabled={!selectedFilmId}
                            >
                                Film verknüpfen
                            </Button>
                        </Stack>
                    )}
                    {id && (
                        <Stack spacing={1}>
                            {input.films && input.films.length > 0 ? (
                                input.films.map((film: any) => (
                                    <Stack key={film.film_id} direction="row" spacing={2} alignItems="center">
                                        <span>{film.title}</span>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => handleRemoveFilm(film.film_id)}
                                        >
                                            Entfernen
                                        </Button>
                                    </Stack>
                                ))
                            ) : (
                                <Typography color="text.secondary">Noch keine Filme hinzugefügt</Typography>
                            )}
                        </Stack>
                    )}
                    {!id && (
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleCreateAndNavigate}
                        >
                            Schauspieler verknüpfen
                        </Button>
                    )}



                </Box>
            </Stack>
        </Box>
    );
};

export default ActorPageForm;