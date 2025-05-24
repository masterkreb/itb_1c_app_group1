import React, { useEffect, useState } from "react";
import { getAllFilms } from "../services/FilmService";
import { Film } from "../types/types";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Stack, Typography, CircularProgress, IconButton, Tooltip, Alert, Snackbar
} from "@mui/material";
import { NavLink, useNavigate, useLocation } from "react-router";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

/**
 * FilmPage – Zeigt eine übersichtliche Liste aller Filme mit Aktionen.
 * REST-konform, mit Fehlerbehandlung, Navigationsbutton und sauberem Layout.
 *
 * @returns React-Komponente
 */
const FilmPage: React.FC = () => {
    const [films, setFilms] = useState<Film[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [feedback, setFeedback] = useState<{message: string, type: 'success' | 'error'} | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        loadFilms();
        
        // Feedback-Nachricht aus Location State
        if (location.state?.feedback) {
            setFeedback(location.state.feedback);
            // State zurücksetzen, damit die Nachricht beim Refresh nicht wieder angezeigt wird
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location]);

    /**
     * Holt alle Filme aus dem Backend.
     */
    async function loadFilms() {
        setLoading(true);
        try {
            const data = await getAllFilms();
            setFilms(data);
            setError(null);
        } catch (err: any) {
            setError("Filme konnten nicht geladen werden.");
            setFilms([]);
        } finally {
            setLoading(false);
        }
    }

    const handleCloseFeedback = () => {
        setFeedback(null);
    };

    return (
        <div>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h4">Filme verwalten</Typography>
                    <Tooltip title="Aktualisieren">
                        <IconButton onClick={loadFilms} color="primary">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/film/new")}
                >
                    Neuen Film anlegen
                </Button>
            </Stack>

            {/* Feedback-Nachricht */}
            <Snackbar 
                open={feedback !== null} 
                autoHideDuration={6000} 
                onClose={handleCloseFeedback}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseFeedback} 
                    severity={feedback?.type || 'info'} 
                    variant="filled"
                >
                    {feedback?.message}
                </Alert>
            </Snackbar>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Titel</TableCell>
                            <TableCell>Preis</TableCell>
                            <TableCell>Dauer</TableCell>
                            <TableCell align="right">Aktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <CircularProgress size={24} />
                                    <Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>
                                        Lade Filme...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ color: "error.main", py: 2 }}>
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : films.length > 0 ? (
                            films.map((film) => (
                                <TableRow key={film.film_id} hover>
                                    <TableCell>{film.film_id}</TableCell>
                                    <TableCell>{film.title}</TableCell>
                                    <TableCell>{film.rental_rate}</TableCell>
                                    <TableCell>{film.length}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Details anzeigen">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                component={NavLink}
                                                to={`/film/${film.film_id}`}
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Bearbeiten">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                component={NavLink}
                                                to={`/film/${film.film_id}/edit`}
                                                sx={{ ml: 1 }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                                    Keine Filme vorhanden
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default FilmPage;
