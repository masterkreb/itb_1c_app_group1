// src/pages/FilmDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Film, Actor } from "../types/types";
import { getFilmById, deleteFilm, addActorToFilm, removeActorFromFilm } from "../services/FilmService";
import { getAllActors } from "../services/ActorService";
import {
    Button, Paper, Typography, Box, List, ListItem, ListItemText, ListItemSecondaryAction,
    IconButton, Divider, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent,
    CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * FilmDetailPage zeigt detaillierte Informationen zu einem Film an und
 * erlaubt das Verwalten von Film-Schauspieler-Beziehungen.
 * 
 * @returns React-Komponente
 */
const FilmDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [film, setFilm] = useState<Film | null>(null);
    const [allActors, setAllActors] = useState<Actor[]>([]);
    const [selectedActorId, setSelectedActorId] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    /**
     * Lädt die Film-Daten und alle verfügbaren Schauspieler
     */
    useEffect(() => {
        if (id) {
            loadFilmData();
            loadAllActors();
        }
    }, [id]);

    /**
     * Lädt die detaillierten Daten des aktuellen Films
     */
    const loadFilmData = async () => {
        if (id) {
            setLoading(true);
            try {
                const filmData = await getFilmById(Number(id));
                if (filmData) {
                    setFilm(filmData);
                    setError(null);
                } else {
                    setError("Film konnte nicht geladen werden.");
                }
            } catch (err: any) {
                console.error("Fehler beim Laden des Films:", err);
                setError(`Fehler beim Laden des Films: ${err.message || "Unbekannter Fehler"}`);
            } finally {
                setLoading(false);
            }
        }
    };

    /**
     * Lädt alle verfügbaren Schauspieler für die Auswahlliste
     */
    const loadAllActors = async () => {
        try {
            const actors = await getAllActors();
            setAllActors(actors);
            if (actors.length > 0) {
                setSelectedActorId(actors[0].actor_id);
            }
        } catch (err: any) {
            console.error("Fehler beim Laden der Schauspieler:", err);
            // Fehler beim Laden der Schauspieler sind nicht kritisch für die Hauptfunktion
        }
    };

    /**
     * Löscht den aktuellen Film und navigiert zurück zur Übersicht
     */
    const handleDelete = async () => {
        if (id) {
            setLoading(true);
            try {
                await deleteFilm(Number(id));
                navigate("/film");
            } catch (err: any) {
                console.error("Fehler beim Löschen des Films:", err);
                setError(`Fehler beim Löschen: ${err.message || "Unbekannter Fehler"}`);
                setLoading(false);
            }
        }
    };

    /**
     * Fügt einen ausgewählten Schauspieler zum Film hinzu
     */
    const handleAddActor = async () => {
        if (id && selectedActorId) {
            try {
                await addActorToFilm(Number(id), selectedActorId);
                loadFilmData(); // Aktualisiere die Daten nach dem Hinzufügen
            } catch (err: any) {
                console.error("Fehler beim Hinzufügen des Schauspielers:", err);
                setError(`Fehler beim Hinzufügen: ${err.message || "Unbekannter Fehler"}`);
            }
        }
    };

    /**
     * Entfernt einen Schauspieler vom Film
     * 
     * @param actorId ID des zu entfernenden Schauspielers
     */
    const handleRemoveActor = async (actorId: number) => {
        if (id) {
            try {
                await removeActorFromFilm(Number(id), actorId);
                loadFilmData(); // Aktualisiere die Daten nach dem Entfernen
            } catch (err: any) {
                console.error("Fehler beim Entfernen des Schauspielers:", err);
                setError(`Fehler beim Entfernen: ${err.message || "Unbekannter Fehler"}`);
            }
        }
    };

    /**
     * Behandelt die Änderung des ausgewählten Schauspielers in der Dropdown-Liste
     */
    const handleActorChange = (event: SelectChangeEvent<number>) => {
        setSelectedActorId(Number(event.target.value));
    };

    /**
     * Filtert Schauspieler, die noch nicht zum Film hinzugefügt wurden
     */
    const getAvailableActors = () => {
        if (!film || !film.actors) return allActors;
        return allActors.filter(actor => 
            !film.actors?.some(filmActor => filmActor.actor_id === actor.actor_id)
        );
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
            <Typography variant="h4" gutterBottom>Filmdetails</Typography>
            
            {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body1" sx={{ mt: 2 }}>Lade Film-Daten...</Typography>
                </Box>
            ) : error ? (
                <Box sx={{ py: 2, color: 'error.main' }}>
                    <Typography variant="body1">{error}</Typography>
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/film")}
                        sx={{ mt: 2 }}
                    >
                        Zurück zur Übersicht
                    </Button>
                </Box>
            ) : film ? (
                <Box>
                    <Typography variant="h5">{film.title}</Typography>
                    <Typography variant="body1" paragraph>{film.description}</Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
                        <Typography variant="body2">Jahr: {film.release_year}</Typography>
                        <Typography variant="body2">Dauer: {film.length} Min.</Typography>
                        <Typography variant="body2">Bewertung: {film.rating}</Typography>
                        <Typography variant="body2">Preis: {film.rental_rate}</Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="h6" gutterBottom>Schauspieler</Typography>
                    
                    {film.actors && film.actors.length > 0 ? (
                        <List>
                            {film.actors.map((actor) => (
                                <ListItem key={actor.actor_id}>
                                    <ListItemText 
                                        primary={`${actor.first_name} ${actor.last_name}`} 
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton 
                                            edge="end" 
                                            aria-label="delete"
                                            onClick={() => handleRemoveActor(actor.actor_id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2">Keine Schauspieler vorhanden</Typography>
                    )}
                    
                    <Box sx={{ mt: 2, mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>Schauspieler hinzufügen:</Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel id="actor-select-label">Schauspieler</InputLabel>
                                <Select
                                    labelId="actor-select-label"
                                    value={selectedActorId}
                                    onChange={handleActorChange}
                                    label="Schauspieler"
                                    disabled={getAvailableActors().length === 0}
                                >
                                    {getAvailableActors().map((actor) => (
                                        <MenuItem key={actor.actor_id} value={actor.actor_id}>
                                            {actor.first_name} {actor.last_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={handleAddActor}
                                disabled={getAvailableActors().length === 0}
                            >
                                Hinzufügen
                            </Button>
                        </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate(`/film/${id}/edit`)}
                        >
                            Bearbeiten
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDelete}
                        >
                            Löschen
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/film")}
                        >
                            Zurück
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Typography>Film nicht gefunden</Typography>
            )}
        </Paper>
    );
};

export default FilmDetailPage;
