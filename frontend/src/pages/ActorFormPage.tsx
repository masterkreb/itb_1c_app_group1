// src/pages/ActorFormPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Actor } from "../types/types";
import { getActorById, createActor, updateActor } from "../services/ActorService";
import { TextField, Button, Paper, Box, Typography, CircularProgress } from "@mui/material";

const defaultActor: Partial<Actor> = {
    first_name: "",
    last_name: ""
};

/**
 * ActorFormPage - Komponente zum Erstellen und Bearbeiten von Schauspielern
 *
 * @returns React-Komponente
 */
const ActorFormPage = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [actor, setActor] = useState<Partial<Actor>>(defaultActor);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const isEditMode = id && id !== "new";

    useEffect(() => {
        if (isEditMode) {
            loadActor(Number(id));
        }
    }, [id]);

    /**
     * Lädt die Schauspieler-Daten für den Bearbeitungsmodus
     */
    const loadActor = async (actorId: number) => {
        setLoading(true);
        try {
            const data = await getActorById(actorId);
            if (data) {
                setActor(data);
                setError(null);
            } else {
                setError("Schauspieler konnte nicht geladen werden");
            }
        } catch (err: any) {
            setError(`Fehler beim Laden des Schauspielers: ${err.message || "Unbekannter Fehler"}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setActor({ ...actor, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                await updateActor(Number(id), actor as Actor);
            } else {
                await createActor(actor as Actor);
            }
            navigate("/actor");
        } catch (err: any) {
            setError(`Fehler beim Speichern: ${err.message || "Unbekannter Fehler"}`);
            console.error("Fehler beim Speichern:", err);
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return (
            <Paper sx={{ p: 3, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2 }}>Lade Schauspieler...</Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3, maxWidth: 500, margin: "0 auto" }}>
            <Typography variant="h5" gutterBottom>
                {isEditMode ? "Schauspieler bearbeiten" : "Neuen Schauspieler anlegen"}
            </Typography>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    label="Vorname"
                    name="first_name"
                    value={actor.first_name || ""}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Nachname"
                    name="last_name"
                    value={actor.last_name || ""}
                    onChange={handleChange}
                    required
                    fullWidth
                />

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? "Speichern..." : (isEditMode ? "Speichern" : "Anlegen")}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/actor")}
                    >
                        Abbrechen
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default ActorFormPage;
