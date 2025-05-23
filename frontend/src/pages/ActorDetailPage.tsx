// src/pages/ActorDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Actor, Film } from "../types/types";
import { getActorById, deleteActor, addActorToFilmFromActor, removeActorFromFilmFromActor } from "../services/ActorService";
import { getAllFilms } from "../services/FilmService";
import { Button, Paper, Typography, Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton,
    Divider, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * ActorDetailPage zeigt detaillierte Informationen zu einem Schauspieler an und
 * erlaubt das Verwalten von Film-Schauspieler-Beziehungen.
 * 
 * @returns React-Komponente
 */
const ActorDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [actor, setActor] = useState<Actor | null>(null);
    const [allFilms, setAllFilms] = useState<Film[]>([]);
    const [selectedFilmId, setSelectedFilmId] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    /**
     * Lädt die Schauspieler-Daten und alle verfügbaren Filme
     */
    useEffect(() => {
        if (id) {
            loadActorData();
            loadAllFilms();
        }
    }, [id]);

    /**
     * Lädt die detaillierten Daten des aktuellen Schauspielers
     */
    const loadActorData = async () => {
        if (id) {
            setLoading(true);
            try {
                const actorData = await getActorById(Number(id));
                if (actorData) {
                    setActor(actorData);
                    setError(null);
                } else {
                    setError("Schauspieler konnte nicht geladen werden.");
                }
            } catch (err: any) {
                console.error("Fehler beim Laden des Schauspielers:", err);
                setError(`Fehler beim Laden des Schauspielers: ${err.message || "Unbekannter Fehler"}`);
            } finally {
                setLoading(false);
            }
        }
    };

    /**
     * Lädt alle verfügbaren Filme für die Auswahlliste
     */
    const loadAllFilms = async () => {
        try {
            const films = await getAllFilms();
            setAllFilms(films);
            if (films.length > 0) {
                setSelectedFilmId(films[0].film_id || 0);
            }
        } catch (err: any) {
            console.error("Fehler beim Laden der Filme:", err);
            // Fehler beim Laden der Filme sind nicht kritisch für die Hauptfunktion
        }
    };

    /**
     * Löscht den aktuellen Schauspieler und navigiert zurück zur Übersicht
     */
    const handleDelete = async () => {
        if (id) {
            setLoading(true);
            try {
                await deleteActor(Number(id));
                navigate("/actor");
            } catch (err: any) {
                console.error("Fehler beim Löschen des Schauspielers:", err);
                setError(`Fehler beim Löschen: ${err.message || "Unbekannter Fehler"}`);
                setLoading(false);
            }
        }
    };

    /**
     * Fügt den Schauspieler zu einem ausgewählten Film hinzu
     */
    const handleAddFilm = async () => {
        if (id && selectedFilmId) {
            try {
                await addActorToFilmFromActor(Number(id), selectedFilmId);
                loadActorData(); // Aktualisiere die Daten nach dem Hinzufügen
            } catch (err: any) {
                console.error("Fehler beim Hinzufügen des Films:", err);
                setError(`Fehler beim Hinzufügen: ${err.message || "Unbekannter Fehler"}`);
            }
        }
    };

    /**
     * Entfernt den Schauspieler von einem Film
     * 
     * @param filmId ID des Films, von dem der Schauspieler entfernt werden soll
     */
    const handleRemoveFilm = async (filmId: number) => {
        if (id) {
            try {
                await removeActorFromFilmFromActor(Number(id), filmId);
                loadActorData(); // Aktualisiere die Daten nach dem Entfernen
            } catch (err: any) {
                console.error("Fehler beim Entfernen des Films:", err);
                setError(`Fehler beim Entfernen: ${err.message || "Unbekannter Fehler"}`);
            }
        }
    };

    /**
     * Behandelt die Änderung des ausgewählten Films in der Dropdown-Liste
     */
    const handleFilmChange = (event: SelectChangeEvent<number>) => {
        setSelectedFilmId(Number(event.target.value));
    };

    /**
     * Filtert Filme, die noch nicht mit dem Schauspieler verknüpft sind
     */
    const getAvailableFilms = () => {
        if (!actor || !actor.films) return allFilms;
        return allFilms.filter(film => 
            !actor.films?.some(actorFilm => actorFilm.film_id === film.film_id)
        );
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
            <Typography variant="h4" gutterBottom>Schauspieler-Details</Typography>
            
            {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body1" sx={{ mt: 2 }}>Lade Schauspieler-Daten...</Typography>
                </Box>
            ) : error ? (
                <Box sx={{ py: 2, color: 'error.main' }}>
                    <Typography variant="body1">{error}</Typography>
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/actor")}
                        sx={{ mt: 2 }}
                    >
                        Zurück zur Übersicht
                    </Button>
                </Box>
            ) : actor ? (
                <Box>
                    <Typography variant="h5">{actor.first_name} {actor.last_name}</Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="h6" gutterBottom>Filme</Typography>
                    
                    {actor.films && actor.films.length > 0 ? (
                        <List>
                            {actor.films.map((film) => (
                                <ListItem key={film.film_id}>
                                    <ListItemText 
                                        primary={film.title} 
                                        secondary={`${film.release_year} | ${film.length} Min.`}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton 
                                            edge="end" 
                                            aria-label="delete"
                                            onClick={() => handleRemoveFilm(film.film_id || 0)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2">Keine Filme vorhanden</Typography>
                    )}
                    
                    <Box sx={{ mt: 2, mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>Film hinzufügen:</Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel id="film-select-label">Film</InputLabel>
                                <Select
                                    labelId="film-select-label"
                                    value={selectedFilmId}
                                    onChange={handleFilmChange}
                                    label="Film"
                                    disabled={getAvailableFilms().length === 0}
                                >
                                    {getAvailableFilms().map((film) => (
                                        <MenuItem key={film.film_id} value={film.film_id}>
                                            {film.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={handleAddFilm}
                                disabled={getAvailableFilms().length === 0}
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
                            onClick={() => navigate(`/actor/${id}/edit`)}
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
                            onClick={() => navigate("/actor")}
                        >
                            Zurück
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Typography>Schauspieler nicht gefunden</Typography>
            )}
        </Paper>
    );
};

export default ActorDetailPage;

