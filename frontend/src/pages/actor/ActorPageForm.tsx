// noinspection JSUnusedLocalSymbols

import React, {useEffect} from 'react';
import {Stack, TextField, FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import Button from "@mui/material/Button";
import JsonView from "@uiw/react-json-view";
import { useParams, useNavigate } from "react-router";
import { getActorById, createActor, updateActor, addFilmToActor, removeFilmFromActor } from "../../service/ActorService.ts";
import { Film } from "../../types/types.ts";
import { getAllFilms } from "../../service/FilmService.ts";

export interface InputType {
    actor_id: string;
    first_name: string;
    last_name: string;
    films?: Film[];
}

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
            required: true,
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



const ActorPageForm = () => {
    const { id } = useParams();
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

    async function loadAllFilms() {
        const films = await getAllFilms();
        setAllFilms(films);
    }

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
            setValidation(defaultValidation); // <--- HIER einfügen
            navigate("/actor");
        } else {
            alert("Speichern fehlgeschlagen.");
        }
    }

    async function handleAddFilm() {
        if (!id || !selectedFilmId) return;

        const success = await addFilmToActor(id, parseInt(selectedFilmId));
        if (success) {
            const film = allFilms.find(f => f.film_id === parseInt(selectedFilmId));
            if (film && !input.films?.some(f => f.film_id === film.film_id)) {
                setInput({
                    ...input,
                    films: [...(input.films || []), film],
                });
            }
            setSelectedFilmId(""); // zurücksetzen
        } else {
            alert("Film konnte nicht verknüpft werden.");
        }
    }

    async function handleRemoveFilm(filmId: number) {
        if (!id) return;

        const confirm = window.confirm("Filmverknüpfung wirklich entfernen?");
        if (!confirm) return;

        const success = await removeFilmFromActor(id, filmId);
        if (success) {
            setInput({
                ...input,
                films: input.films?.filter((f) => f.film_id !== filmId),
            });
        } else {
            alert("Entfernen fehlgeschlagen.");
        }
    }

    return (
        <div>
            Actor Page
            <Stack spacing={2} direction={"row"}>
                <Stack spacing={2} justifyContent="flex-start" direction="column" alignItems="flex-start">

                    <TextField
                        label="Actor ID"
                        variant="standard"
                        value={input.actor_id}
                        error={!validation.actor_id?.valid}
                        helperText={!validation.actor_id?.valid && validation.actor_id?.message}
                        onChange={(e) =>
                            handleInputChanged("actor_id", e.target.value)
                        }
                    />

                    <TextField
                        label="Vorname"
                        variant="standard"
                        value={input.first_name}
                        error={!validation.first_name?.valid}
                        helperText={!validation.first_name?.valid && validation.first_name?.message}
                        onChange={(e) =>
                            handleInputChanged("first_name", e.target.value)
                        }
                    />

                    <TextField
                        label="Nachname"
                        variant="standard"
                        value={input.last_name}
                        error={!validation.last_name?.valid}
                        helperText={!validation.last_name?.valid && validation.last_name?.message}
                        onChange={(e) =>
                            handleInputChanged("last_name", e.target.value)
                        }
                    />

                    <FormControl variant="standard" sx={{ minWidth: 200 }}>
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

                    {input.films && input.films.length > 0 && (
                        <div>
                            <h4>Verknüpfte Filme:</h4>
                            <ul>
                                {input.films.map((film) => (
                                    <li key={film.film_id}>
                                        {film.title}
                                        <Button
                                            size="small"
                                            color="error"
                                            variant="outlined"
                                            style={{ marginLeft: "10px" }}
                                            onClick={() => film.film_id !== undefined && handleRemoveFilm(film.film_id)}
                                        >
                                            Entfernen
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <Button variant="contained" onClick={handleSaveClicked}> Save</Button>
                </Stack>
                <JsonView value={input}/>
                <JsonView value={validation}/>
            </Stack>
        </div>
    );
};

export default ActorPageForm;