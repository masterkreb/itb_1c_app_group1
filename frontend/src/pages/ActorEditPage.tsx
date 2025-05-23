// src/pages/ActorEditPage.tsx
// noinspection JSUnusedLocalSymbols

import React, { useEffect, useState } from "react";
import {
    Stack,
    TextField,
    Button,
    Typography
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import JsonView from "@uiw/react-json-view";

import {
    getActorById,
    createActor,
    updateActor
} from "../service/ActorService";
import { Actor, ActorInput } from "../types/types";

export interface InputType {
    actor_id?: number;        // fällt weg im Create-Modus
    first_name: string;
    last_name: string;
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
    actor_id: undefined,
    first_name: "",
    last_name: ""
};

const defaultValidation: ValidationFieldset = {
    first_name: {
        validation: {
            required: true,
            minLength: 2,
            maxLength: 45,
            pattern: /^[a-zA-Z\s]+$/
        },
        message: "",
        valid: true
    },
    last_name: {
        validation: {
            required: true,
            minLength: 2,
            maxLength: 45,
            pattern: /^[a-zA-Z\s]+$/
        },
        message: "",
        valid: true
    }
};

/**
 * ActorEditPage - Komponente zum Erstellen und Bearbeiten von Schauspielern
 *
 * Diese Komponente stellt ein Formular zum Anlegen neuer Schauspieler oder
 * zum Bearbeiten bestehender Schauspieler dar. Sie bietet Validierung der
 * Eingabefelder und kommuniziert mit dem ActorService.
 *
 * @example
 * <ActorEditPage />
 *
 * @returns {JSX.Element} Die gerenderte Komponente
 */
const ActorEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [input, setInput] = useState<InputType>({ ...defaultInput });
    const [validation, setValidation] = useState<ValidationFieldset>({
        ...defaultValidation
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Wenn id gesetzt ist, lade vorhandene Daten (Edit-Modus)
    useEffect(() => {
        if (id) {
            (async () => {
                setLoading(true);
                setError(null);

                try {
                    const parsedId = parseInt(id, 10);
                    const actorData: Actor = await getActorById(parsedId);
                    setInput({
                        actor_id: actorData.actor_id,
                        first_name: actorData.first_name,
                        last_name: actorData.last_name
                    });
                } catch (err) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Fehler beim Laden der Schauspielerdaten."
                    );
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [id]);

    /**
     * Aktualisiert den Input-State bei Änderungen in den Formularfeldern
     *
     * @param {keyof InputType} key - Der Schlüssel des zu aktualisierenden Feldes
     * @param {unknown} value - Der neue Wert für das Feld
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
            const val = rawValue as string;

            if (rules?.validation) {
                // Required prüfen
                if (
                    rules.validation.required &&
                    (val === "" || val === undefined)
                ) {
                    rules.valid = false;
                    rules.message = "Bitte einen Wert angeben.";
                    formIsValid = false;
                    return;
                }
                // MinLength prüfen
                if (
                    rules.validation.minLength &&
                    val.length < rules.validation.minLength
                ) {
                    rules.valid = false;
                    rules.message = `Mindestens ${rules.validation.minLength} Zeichen.`;
                    formIsValid = false;
                    return;
                }
                // MaxLength prüfen
                if (
                    rules.validation.maxLength &&
                    val.length > rules.validation.maxLength
                ) {
                    rules.valid = false;
                    rules.message = `Maximal ${rules.validation.maxLength} Zeichen.`;
                    formIsValid = false;
                    return;
                }
                // Pattern prüfen
                if (
                    rules.validation.pattern &&
                    !rules.validation.pattern.test(val)
                ) {
                    rules.valid = false;
                    rules.message = "Ungültiges Format. Nur Buchstaben und Leerzeichen erlaubt.";
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

        // ActorInput (ohne actor_id) bauen
        const payload: ActorInput = {
            first_name: input.first_name,
            last_name: input.last_name
        };

        try {
            if (id) {
                // Edit-Modus
                await updateActor(Number(id), payload);
            } else {
                // Create-Modus
                await createActor(payload);
            }
            // Nach Speichern zurück zur Listen-Seite
            navigate("/actor");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Fehler beim Speichern des Schauspielers."
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
                {id ? `Schauspieler bearbeiten (ID: ${id})` : "Neuen Schauspieler anlegen"}
            </Typography>

            <Stack spacing={2} direction="column" sx={{ maxWidth: 600 }}>
                <TextField
                    required
                    label="Vorname"
                    variant="standard"
                    value={input.first_name}
                    onChange={(e) => handleInputChanged("first_name", e.target.value)}
                    error={validation.first_name?.valid === false}
                    helperText={validation.first_name?.message}
                />

                <TextField
                    required
                    label="Nachname"
                    variant="standard"
                    value={input.last_name}
                    onChange={(e) => handleInputChanged("last_name", e.target.value)}
                    error={validation.last_name?.valid === false}
                    helperText={validation.last_name?.message}
                />

                <Button
                    variant="contained"
                    onClick={handleSaveClicked}
                    disabled={loading}
                >
                    {id ? "Änderungen speichern" : "Schauspieler anlegen"}
                </Button>

                {/* Debug-Ansicht: Input- und Validation-Objekt */}
                <JsonView value={input} />
                <JsonView value={validation} />
            </Stack>
        </div>
    );
};

export default ActorEditPage;