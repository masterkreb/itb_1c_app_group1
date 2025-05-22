// frontend/src/pages/ActorFormular.tsx

import React, { useEffect, useState } from "react";
import {Stack, TextField, Button, Typography,
FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import JsonView from "@uiw/react-json-view";
import { useParams, useNavigate } from "react-router-dom";
import {
    getActorById,
    createActor,
    updateActor
} from "../service/ActorService";
import { getAllFilms } from "../service/FilmService";  // ← neu
import { Film } from "../types/types";                 // ← neu

// Eingabe-Typ für das Formular
export interface InputType {
    id: string;
    first_name: string;
    last_name: string;
}

// Default-Werte für das Formular (Create-Modus)
const defaultInput: InputType = {
    id: "",
    first_name: "",
    last_name: ""
};

// Validation-Setup (unverändert)
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

const defaultValidation: ValidationFieldset = {
    id: { validation: { required: false }, valid: true },
    first_name: {
        validation: {
            required: true,
            minLength: 1,
            maxLength: 20,
            pattern: /^[a-zA-Z0-9\s]+$/
        },
        valid: true
    },
    last_name: {
        validation: {
            required: true,
            minLength: 1,
            maxLength: 20,
            pattern: /^[a-zA-Z0-9\s]+$/
        },
        valid: true
    }
};

const ActorFormular: React.FC = () => {
    // ① Lese die ID aus der URL: wenn vorhanden, bist du im Edit-Modus
    const { id } = useParams<{ id: string }>();
    // ② Hook zum Navigieren nach Save oder Cancel
    const navigate = useNavigate();

    // Form- und Validation-State
    const [input, setInput] = useState<InputType>(defaultInput);
    const [validation, setValidation] = useState<ValidationFieldset>(defaultValidation);

    // === NEU: State für Filme & Auswahl ===
    const [allFilms, setAllFilms] = useState<Film[]>([]);
    const [selectedFilms, setSelectedFilms] = useState<number[]>([]);

    // ③ Beim ersten Render: lade Filme und ggf. bestehenden Actor
    useEffect(() => {
        // Filme laden für Multi-Select
        getAllFilms().then(films => {
            if (films) setAllFilms(films);
        });

        // Actor laden
        if (id) {
            getActorById(id).then(actor => {
                if (actor) {
                    // Input befüllen
                    setInput({
                        id: actor.actor_id.toString(),
                        first_name: actor.first_name,
                        last_name: actor.last_name
                    });
                    // falls actor.films mitkommt, initiale Auswahl setzen
                    if (actor.films) {
                        setSelectedFilms(actor.films.map(f => f.film_id!));
                    }
                }
            });
        }
    }, [id]);

    // Handler für alle TextField-Änderungen
    function handleInputChanged(key: keyof InputType, value: unknown) {
        setInput(prev => ({ ...prev, [key]: value as string }));
    }

    // Formular-Validation (bleibt unverändert)
    function validateForm(): boolean {
        let formIsValid = true;
        Object.entries(input).forEach(([key, value]) => {
            const field = key as keyof InputType;
            const opts = validation[field];
            if (opts?.validation) {
                if (opts.validation.required && !value) {
                    opts.valid = false;
                    opts.message = "Bitte einen Wert angeben.";
                    formIsValid = false;
                } else if (
                    opts.validation.minLength &&
                    typeof value === "string" &&
                    value.length < opts.validation.minLength
                ) {
                    opts.valid = false;
                    opts.message = `Mindestens ${opts.validation.minLength} Zeichen.`;
                    formIsValid = false;
                } else if (
                    opts.validation.maxLength &&
                    typeof value === "string" &&
                    value.length > opts.validation.maxLength
                ) {
                    opts.valid = false;
                    opts.message = `Maximal ${opts.validation.maxLength} Zeichen.`;
                    formIsValid = false;
                } else if (
                    opts.validation.pattern &&
                    typeof value === "string" &&
                    !opts.validation.pattern.test(value)
                ) {
                    opts.valid = false;
                    opts.message = "Ungültiges Format.";
                    formIsValid = false;
                } else {
                    opts.valid = true;
                    opts.message = "";
                }
                setValidation(prev => ({
                    ...prev,
                    [field]: { ...opts }
                }));
            }
        });
        return formIsValid;
    }

    // Save-Handler: unterscheidet Create vs. Update, inkl. n:n-Verknüpfung
    async function handleSaveClicked(): Promise<void> {
        if (!validateForm()) return;

        let actorId: number | undefined;
        if (id) {
            // Update-Modus
            const updated = await updateActor(id, {
                first_name: input.first_name,
                last_name: input.last_name
            });
            if (updated) actorId = Number(id);
            else {
                alert("Update fehlgeschlagen.");
                return;
            }
        } else {
            // Create-Modus
            const newId = await createActor({
                first_name: input.first_name,
                last_name: input.last_name
            });
            if (newId) actorId = newId;
            else {
                alert("Erstellung fehlgeschlagen.");
                return;
            }
        }

        // ==== NEU: n:n Actor↔Film aktualisieren ====
        if (actorId !== undefined) {
            // alle alten Zuordnungen löschen
            await Promise.all(
                allFilms.map(f =>
                    fetch(`http://localhost:3000/actor/${actorId}/film/${f.film_id}`, {
                        method: "DELETE"
                    })
                )
            );
            // nur ausgewählte Zuordnungen neu anlegen
            await Promise.all(
                selectedFilms.map(fid =>
                    fetch(`http://localhost:3000/actor/${actorId}/film/${fid}`, {
                        method: "POST"
                    })
                )
            );
        }

        setValidation(defaultValidation);
        navigate("/actor");
    }

    return (
        <div>
            {/* Überschrift je nach Modus */}
            <Typography variant="h5" gutterBottom>
                {id ? `Actor bearbeiten (ID ${id})` : "Neuen Actor anlegen"}
            </Typography>

            <Stack spacing={2} maxWidth={400}>
                {/* Vorname */}
                <TextField
                    label="Vorname"
                    variant="standard"
                    value={input.first_name}
                    onChange={e => handleInputChanged("first_name", e.target.value)}
                />
                {/* Nachname */}
                <TextField
                    label="Nachname"
                    variant="standard"
                    value={input.last_name}
                    onChange={e => handleInputChanged("last_name", e.target.value)}
                />

                {/* === NEU: Multi-Select Filme === */}
                <FormControl variant="standard" fullWidth>
                    <InputLabel id="film-multi-label">Filme</InputLabel>
                    <Select
                        labelId="film-multi-label"
                        multiple
                        value={selectedFilms}
                        onChange={(e: SelectChangeEvent<number[]>) =>
                            setSelectedFilms(e.target.value as number[])
                        }
                        renderValue={vals =>
                            allFilms
                                .filter(f => vals.includes(f.film_id!))
                                .map(f => f.title)
                                .join(", ")
                        }
                    >
                        {allFilms.map(f => (
                            <MenuItem key={f.film_id} value={f.film_id!}>
                                {f.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Save- & Cancel-Buttons */}
                <Stack direction="row" spacing={2} pt={2}>
                    <Button variant="contained" onClick={handleSaveClicked}>
                        Save
                    </Button>
                    <Button variant="outlined" onClick={() => navigate("/actor")}>
                        Cancel
                    </Button>
                </Stack>
            </Stack>

            {/* Debug-Ausgabe: Input & Validation */}
            <Typography variant="subtitle2" pt={4}>
                Debug: Input
            </Typography>
            <JsonView value={input} collapsed />

            <Typography variant="subtitle2" pt={2}>
                Debug: Validation
            </Typography>
            <JsonView value={validation} collapsed />

            {/* Debug-Ausgabe: Selected Films */}
            <Typography variant="subtitle2" pt={2}>
                Debug: Ausgewählte Filme
            </Typography>
            <JsonView value={selectedFilms} collapsed />
        </div>
    );
};

export default ActorFormular;
