// src/pages/FilmFormPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Film } from "../types/types";
import { getFilmById, createFilm, updateFilm } from "../services/FilmService";
import { TextField, Button, Paper, Box, Typography, CircularProgress } from "@mui/material";

const defaultFilm: Film = {
    title: "",
    description: "",
    release_year: new Date().getFullYear(),
    language_id: 1, // Standardmäßig Englisch (ID 1)
    rental_duration: 3,
    rental_rate: 4.99,
    length: 120,
    replacement_cost: 19.99,
    rating: "PG",
    special_features: ""
};

/**
 * FilmFormPage - Komponente zum Erstellen und Bearbeiten von Filmen
 *
 * @returns React-Komponente
 */
const FilmFormPage = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [film, setFilm] = useState<Film>(defaultFilm);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const isEditMode = id && id !== "new";

    useEffect(() => {
        if (isEditMode) {
            loadFilm(Number(id));
        }
    }, [id]);

    /**
     * Lädt die Film-Daten für den Bearbeitungsmodus
     */
    const loadFilm = async (filmId: number) => {
        setLoading(true);
        try {
            const data = await getFilmById(filmId);
            if (data) {
                setFilm(data);
                setError(null);
            } else {
                setError("Film konnte nicht geladen werden");
            }
        } catch (err: any) {
            setError(`Fehler beim Laden des Films: ${err.message || "Unbekannter Fehler"}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Konvertiere numerische Werte
        const numericFields = ['release_year', 'rental_duration', 'rental_rate', 'length', 'replacement_cost'];
        const newValue = numericFields.includes(name) ? Number(value) : value;

        setFilm({ ...film, [name]: newValue });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                await updateFilm(Number(id), film);
            } else {
                await createFilm(film);
            }
            navigate("/film");
        } catch (err: any) {
            setError(`Fehler beim Speichern des Films: ${err.message || "Unbekannter Fehler"}`);
            console.error("Fehler beim Speichern:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return (
            <Paper sx={{ p: 3, maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2 }}>Lade Film...</Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3, maxWidth: 500, margin: "0 auto" }}>
            <Typography variant="h5" gutterBottom>
                {isEditMode ? "Film bearbeiten" : "Neuen Film anlegen"}
            </Typography>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    label="Titel"
                    name="title"
                    value={film.title}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Beschreibung"
                    name="description"
                    value={film.description}
                    onChange={handleChange}
                    required
                    multiline
                    rows={3}
                    fullWidth
                />
                <TextField
                    label="Erscheinungsjahr"
                    name="release_year"
                    type="number"
                    value={film.release_year}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Sprache ID"
                    name="language_id"
                    type="number"
                    value={film.language_id}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Ausleihdauer (Tage)"
                    name="rental_duration"
                    type="number"
                    value={film.rental_duration}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Ausleihpreis"
                    name="rental_rate"
                    type="number"
                    inputProps={{ step: "0.01" }}
                    value={film.rental_rate}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Länge (Min.)"
                    name="length"
                    type="number"
                    value={film.length}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Ersatzkosten"
                    name="replacement_cost"
                    type="number"
                    inputProps={{ step: "0.01" }}
                    value={film.replacement_cost}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Bewertung"
                    name="rating"
                    value={film.rating}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Extras"
                    name="special_features"
                    value={film.special_features || ""}
                    onChange={handleChange}
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
                        onClick={() => navigate("/film")}
                    >
                        Abbrechen
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default FilmFormPage;
