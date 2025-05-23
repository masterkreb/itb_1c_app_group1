// src/pages/ActorDetailsPage.tsx
// noinspection JSUnusedLocalSymbols

import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    DialogActions,
} from "@mui/material";
import { deleteActor, getActorById } from "../service/ActorService";
import { Actor, Film } from "../types/types";
import { getAllFilms } from "../service/FilmService";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { addActorToFilm, removeActorFromFilm } from "../service/FilmActorService";

/**
 * ActorDetailsPage - Zeigt detaillierte Informationen zu einem einzelnen Schauspieler an
 *
 * Diese Komponente lädt die Daten eines Schauspielers anhand seiner ID und zeigt alle
 * Eigenschaften sowie die zugehörigen Filme an. Sie bietet außerdem
 * Funktionen zum Hinzufügen und Entfernen von Filmen.
 *
 * @example
 * <ActorDetailsPage />
 *
 * @returns {JSX.Element} Die gerenderte Schauspieler-Detailseite
 */
const ActorDetailsPage: React.FC = () => {
    // URL-Parameter auslesen (z. B. { id: "123" })
    const { id } = useParams<{ id: string }>();

    // State: Schauspieler-Daten, Loading- und Error-Status
    const [actor, setActor] = useState<Actor | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // State für Dialog zum Hinzufügen von Filmen
    const [open, setOpen] = useState<boolean>(false);
    const [allFilms, setAllFilms] = useState<Film[]>([]);
    const [loadingFilms, setLoadingFilms] = useState<boolean>(false);

    /**
     * Lädt die Daten eines Schauspielers anhand seiner ID
     *
     * @async
     * @function fetchActor
     * @example
     * await fetchActor();
     *
     * @returns {Promise<void>}
     */
    const fetchActor = async () => {
        if (!id) return;

        setLoading(true);
        setError(null);

        try {
            const parsedId = parseInt(id, 10);
            const fetched: Actor = await getActorById(parsedId);
            setActor(fetched);
        } catch (err) {
            console.error("Fehler beim Laden des Schauspielers:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Unbekannter Fehler beim Laden des Schauspielers."
            );
        } finally {
            setLoading(false);
        }
    };

    // Beim Mounten bzw. Ändern von "id" den Schauspieler laden
    useEffect(() => {
        if (!id) {
            setError("Keine Schauspieler-ID angegeben.");
            setLoading(false);
            return;
        }

        fetchActor();
    }, [id]);

    /**
     * Öffnet den Dialog zum Hinzufügen von Filmen und lädt alle verfügbaren Filme
     *
     * @async
     * @function handleOpenAddFilmDialog
     * @example
     * handleOpenAddFilmDialog();
     *
     * @returns {Promise<void>}
     */
    const handleOpenAddFilmDialog = async () => {
        setOpen(true);
        setLoadingFilms(true);
        try {
            const films = await getAllFilms();
            if (films) {
                setAllFilms(films);
            }
        } catch (err) {
            console.error("Fehler beim Laden der Filme:", err);
        } finally {
            setLoadingFilms(false);
        }
    };

    /**
     * Schließt den Dialog zum Hinzufügen von Filmen
     *
     * @function handleClose
     * @example
     * handleClose();
     */
    const handleClose = () => {
        setOpen(false);
    };

    /**
     * Fügt einen Film zum aktuellen Schauspieler hinzu
     *
     * @async
     * @function handleAddFilm
     * @param {number} filmId - Die ID des hinzuzufügenden Films
     * @example
     * await handleAddFilm(123);
     *
     * @returns {Promise<void>}
     */
    const handleAddFilm = async (filmId: number) => {
        if (!actor) return;

        try {
            await addActorToFilm(filmId, actor.actor_id);
            handleClose();
            await fetchActor(); // Schauspieler neu laden, um die aktualisierten Filme zu sehen
        } catch (err) {
            console.error("Fehler beim Hinzufügen des Films:", err);
        }
    };

    /**
     * Entfernt einen Film vom aktuellen Schauspieler
     *
     * @async
     * @function handleRemoveFilm
     * @param {number} filmId - Die ID des zu entfernenden Films
     * @example
     * await handleRemoveFilm(123);
     *
     * @returns {Promise<void>}
     */
    const handleRemoveFilm = async (filmId: number) => {
        if (!actor) return;

        try {
            await removeActorFromFilm(filmId, actor.actor_id);
            await fetchActor(); // Schauspieler neu laden, um die aktualisierten Filme zu sehen
        } catch (err) {
            console.error("Fehler beim Entfernen des Films:", err);
        }
    };

    /**
     * Löscht den aktuellen Schauspieler und navigiert zurück zur Schauspielerübersicht
     *
     * @async
     * @function handleDeleteActor
     * @example
     * await handleDeleteActor();
     *
     * @returns {Promise<void>}
     */
    const handleDeleteActor = async () => {
        if (!actor || !window.confirm(`Schauspieler "${actor.first_name} ${actor.last_name}" wirklich löschen?`)) {
            return;
        }

        try {
            await deleteActor(actor.actor_id);
            // Erfolgsmeldung anzeigen (könnte mit Snackbar/Toast umgesetzt werden)
            // Beispiel mit Alert (nicht optimal, aber einfach)
            alert(`Schauspieler "${actor.first_name} ${actor.last_name}" wurde erfolgreich gelöscht.`);
            // Zurück zur Schauspielerübersicht navigieren
            window.location.href = '/actor';
        } catch (err) {
            console.error("Fehler beim Löschen des Schauspielers:", err);

            // Benutzerfreundliche Fehlermeldung
            if (err instanceof Error && err.message.includes("foreign key constraint")) {
                alert("Dieser Schauspieler kann nicht gelöscht werden, da er noch mit Filmen verknüpft ist. Bitte entfernen Sie zuerst alle Film-Verknüpfungen.");
            } else {
                alert(`Fehler beim Löschen des Schauspielers: ${err instanceof Error ? err.message : "Unbekannter Fehler"}`);
            }
        }
    };

    // Falls gerade geladen wird
    if (loading) {
        return <Typography>Lädt…</Typography>;
    }

    // Wenn ein Fehler aufgetreten ist
    if (error) {
        return (
            <Typography color="error" variant="body1">
                {error}
            </Typography>
        );
    }

    // Wenn kein Schauspieler gefunden wurde
    if (!actor) {
        return <Typography>Kein Schauspieler gefunden.</Typography>;
    }

    return (
        <div>
            {/* Überschrift mit Vor- und Nachname */}
            <Typography variant="h4" gutterBottom>
                Schauspielerdetails: {actor.first_name} {actor.last_name}
            </Typography>

            {/* Buttons für Aktionen */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <Button
                    component={NavLink}
                    to={`/actor-edit/${actor.actor_id}`}
                    variant="contained"
                    color="primary"
                >
                    Schauspieler bearbeiten
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteActor}
                >
                    Schauspieler löschen
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddFilmDialog}
                >
                    Film hinzufügen
                </Button>
            </div>

            {/* Tabelle mit allen Schauspielerdaten */}
            <TableContainer component={Paper}>
                <Table size="small" aria-label="Schauspielerdetails">
                    <TableBody>
                        <TableRow>
                            <TableCell variant="head">ID</TableCell>
                            <TableCell>{actor.actor_id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">Vorname</TableCell>
                            <TableCell>{actor.first_name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">Nachname</TableCell>
                            <TableCell>{actor.last_name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">Filme</TableCell>
                            <TableCell>
                                {actor.films && actor.films.length > 0 ? (
                                    <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                                        {actor.films.map((film: Film) => (
                                            <li key={film.film_id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                                {/* Link zur Film-Detailseite */}
                                                <NavLink to={`/film/${film.film_id}`}>
                                                    {film.title}
                                                </NavLink>

                                                {/* Button zum Entfernen des Films */}
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleRemoveFilm(film.film_id)}
                                                    aria-label="Film entfernen"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    "Keine Filme vorhanden"
                                )}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog zum Hinzufügen von Filmen */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Film hinzufügen</DialogTitle>
                <DialogContent>
                    {loadingFilms ? (
                        <Typography>Lade Filme...</Typography>
                    ) : (
                        <List>
                            {allFilms
                                .filter(film =>
                                    // Nur Filme anzeigen, die noch nicht dem Schauspieler zugeordnet sind
                                    !actor.films || !actor.films.some(f => f.film_id === film.film_id)
                                )
                                .map(film => (
                                    <ListItem
                                        component="div"
                                        sx={{ cursor: 'pointer' }}
                                        key={film.film_id}
                                        onClick={() => handleAddFilm(film.film_id)}
                                    >
                                        <ListItemText
                                            primary={film.title}
                                        />
                                    </ListItem>
                                ))}
                            {allFilms.filter(film =>
                                !actor.films || !actor.films.some(f => f.film_id === film.film_id)
                            ).length === 0 && (
                                <Typography>Alle verfügbaren Filme sind bereits zugeordnet.</Typography>
                            )}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Abbrechen</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ActorDetailsPage;