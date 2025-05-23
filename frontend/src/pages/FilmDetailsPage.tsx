// FilmDetailsPage.tsx
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
import { deleteFilm, getFilmById } from "../service/FilmService";
import { Film, Actor } from "../types/types";
import { getAllActors } from "../service/ActorService";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { addActorToFilm, removeActorFromFilm } from "../service/FilmActorService";

/**
 * FilmDetailsPage - Zeigt detaillierte Informationen zu einem einzelnen Film an
 *
 * Diese Komponente lädt die Daten eines Films anhand seiner ID und zeigt alle
 * Eigenschaften sowie die zugehörigen Schauspieler an. Sie bietet außerdem
 * Funktionen zum Hinzufügen und Entfernen von Schauspielern.
 *
 * @example
 * <FilmDetailsPage />
 *
 * @returns {JSX.Element} Die gerenderte Film-Detailseite
 */
const FilmDetailsPage: React.FC = () => {
    // URL-Parameter auslesen (z. B. { id: "123" })
    const { id } = useParams<{ id: string }>();

    // State: Film-Daten, Loading- und Error-Status
    const [film, setFilm] = useState<Film | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // State für Dialog zum Hinzufügen von Schauspielern
    const [open, setOpen] = useState<boolean>(false);
    const [allActors, setAllActors] = useState<Actor[]>([]);
    const [loadingActors, setLoadingActors] = useState<boolean>(false);

    /**
     * Lädt die Daten eines Films anhand seiner ID
     *
     * @async
     * @function fetchFilm
     * @example
     * await fetchFilm();
     *
     * @returns {Promise<void>}
     */
    const fetchFilm = async () => {
        if (!id) return;

        setLoading(true);
        setError(null);

        try {
            const parsedId = parseInt(id, 10);
            const fetched: Film = await getFilmById(parsedId);
            setFilm(fetched);
        } catch (err) {
            console.error("Fehler beim Laden des Films:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Unbekannter Fehler beim Laden des Films."
            );
        } finally {
            setLoading(false);
        }
    };

    // Beim Mounten bzw. Ändern von "id" den Film laden
    useEffect(() => {
        if (!id) {
            setError("Keine Film-ID angegeben.");
            setLoading(false);
            return;
        }

        fetchFilm();
    }, [id]);

    /**
     * Öffnet den Dialog zum Hinzufügen von Schauspielern und lädt alle verfügbaren Schauspieler
     *
     * @async
     * @function handleOpenAddActorDialog
     * @example
     * handleOpenAddActorDialog();
     *
     * @returns {Promise<void>}
     */
    const handleOpenAddActorDialog = async () => {
        setOpen(true);
        setLoadingActors(true);
        try {
            const actors = await getAllActors();
            if (actors) {
                setAllActors(actors);
            }
        } catch (err) {
            console.error("Fehler beim Laden der Schauspieler:", err);
        } finally {
            setLoadingActors(false);
        }
    };

    /**
     * Schließt den Dialog zum Hinzufügen von Schauspielern
     *
     * @function handleClose
     * @example
     * handleClose();
     */
    const handleClose = () => {
        setOpen(false);
    };

    /**
     * Fügt einen Schauspieler zum aktuellen Film hinzu
     *
     * @async
     * @function handleAddActor
     * @param {number} actorId - Die ID des hinzuzufügenden Schauspielers
     * @example
     * await handleAddActor(123);
     *
     * @returns {Promise<void>}
     */
    const handleAddActor = async (actorId: number) => {
        if (!film) return;

        try {
            await addActorToFilm(film.film_id, actorId);
            handleClose();
            await fetchFilm(); // Film neu laden, um die aktualisierten Schauspieler zu sehen
        } catch (err) {
            console.error("Fehler beim Hinzufügen des Schauspielers:", err);
        }
    };

    /**
     * Entfernt einen Schauspieler vom aktuellen Film
     *
     * @async
     * @function handleRemoveActor
     * @param {number} actorId - Die ID des zu entfernenden Schauspielers
     * @example
     * await handleRemoveActor(123);
     *
     * @returns {Promise<void>}
     */
    const handleRemoveActor = async (actorId: number) => {
        if (!film) return;

        try {
            await removeActorFromFilm(film.film_id, actorId);
            await fetchFilm(); // Film neu laden, um die aktualisierten Schauspieler zu sehen
        } catch (err) {
            console.error("Fehler beim Entfernen des Schauspielers:", err);
        }
    };

    /**
     * Löscht den aktuellen Film und navigiert zurück zur Filmübersicht
     *
     * @async
     * @function handleDeleteFilm
     * @example
     * await handleDeleteFilm();
     *
     * @returns {Promise<void>}
     */
    const handleDeleteFilm = async () => {
        if (!film || !window.confirm(`Film "${film.title}" wirklich löschen?`)) {
            return;
        }

        try {
            await deleteFilm(film.film_id);
            // Zurück zur Filmübersicht navigieren
            window.location.href = '/film';
        } catch (err) {
            console.error("Fehler beim Löschen des Films:", err);
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

    // Wenn kein Film gefunden wurde (z. B. getFilmById hat null oder ähnliches zurückgegeben)
    if (!film) {
        return <Typography>Kein Film gefunden.</Typography>;
    }

    return (
        <div>
            {/* Überschrift mit Titel */}
            <Typography variant="h4" gutterBottom>
                Filmdetails: {film.title}
            </Typography>

            {/* Buttons für Aktionen */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <Button
                    component={NavLink}
                    to={`/film-edit/${film.film_id}`}
                    variant="contained"
                    color="primary"
                >
                    Film bearbeiten
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteFilm}
                >
                    Film löschen
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddActorDialog}
                >
                    Schauspieler hinzufügen
                </Button>
            </div>

            {/* Tabelle mit allen Filmdaten */}
            <TableContainer component={Paper}>
                <Table size="small" aria-label="Filmdetails">
                    <TableBody>
                        <TableRow>
                            <TableCell variant="head">ID</TableCell>
                            <TableCell>{film.film_id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">Titel</TableCell>
                            <TableCell>{film.title}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">Beschreibung</TableCell>
                            <TableCell>{film.description}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">Dauer</TableCell>
                            <TableCell>{film.length} Minuten</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">Erscheinungsjahr</TableCell>
                            <TableCell>{film.release_year}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">Altersfreigabe</TableCell>
                            <TableCell>{film.rating}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">Preis</TableCell>
                            <TableCell>{film.rental_rate} CHF</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">Wiederbeschaffungskosten</TableCell>
                            <TableCell>{film.replacement_cost} CHF</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">Special Features</TableCell>
                            <TableCell>{film.special_features}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell variant="head">Schauspieler</TableCell>
                            <TableCell>
                                {film.actors && film.actors.length > 0 ? (
                                    <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                                        {film.actors.map((actor: Actor) => (
                                            <li key={actor.actor_id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                                {/* Link zur Actor-Detailseite */}
                                                <NavLink to={`/actor/${actor.actor_id}`}>
                                                    {actor.first_name} {actor.last_name}
                                                </NavLink>

                                                {/* Button zum Entfernen des Schauspielers */}
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleRemoveActor(actor.actor_id)}
                                                    aria-label="Schauspieler entfernen"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    "Keine Schauspieler vorhanden"
                                )}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog zum Hinzufügen von Schauspielern */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Schauspieler hinzufügen</DialogTitle>
                <DialogContent>
                    {loadingActors ? (
                        <Typography>Lade Schauspieler...</Typography>
                    ) : (
                        <List>
                            {allActors
                                .filter(actor =>
                                    // Nur Schauspieler anzeigen, die noch nicht dem Film zugeordnet sind
                                    !film.actors || !film.actors.some(a => a.actor_id === actor.actor_id)
                                )
                                .map(actor => (
                                    <ListItem
                                        component="div"
                                        sx={{ cursor: 'pointer' }}
                                        key={actor.actor_id}
                                        onClick={() => handleAddActor(actor.actor_id)}
                                    >
                                        <ListItemText
                                            primary={`${actor.first_name} ${actor.last_name}`}
                                        />
                                    </ListItem>
                                ))}
                            {allActors.filter(actor =>
                                !film.actors || !film.actors.some(a => a.actor_id === actor.actor_id)
                            ).length === 0 && (
                                <Typography>Alle verfügbaren Schauspieler sind bereits zugeordnet.</Typography>
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

export default FilmDetailsPage;