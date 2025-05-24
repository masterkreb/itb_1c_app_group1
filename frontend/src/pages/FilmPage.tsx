import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllFilms, deleteFilm } from '../service/FilmService';
import { Film } from '../types/types';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Stack,
    TextField,
    Typography,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';

const FilmPage: React.FC = () => {
    // State für alle Filme vom Server
    const [films, setFilms] = useState<Film[]>([]);
    // State für den Suchbegriff
    const [searchTerm, setSearchTerm] = useState<string>('');
    // State für die aktuelle Seite
    const [page, setPage] = useState(0);
    // Anzahl der Zeilen pro Seite
    const rowsPerPage = 10;

    // Dialog-State für die Löschbestätigung
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFilmId, setSelectedFilmId] = useState<number | null>(null);

    // Lädt Filme vom Backend (optional gefiltert)
    const loadFilms = async () => {
        const data = await getAllFilms();
        if (data) {
            setFilms(data);
        }
    };

    useEffect(() => {
        loadFilms();
    }, []);

    // Bestätigungsdialog öffnen
    const confirmDelete = (id: number) => {
        setSelectedFilmId(id);
        setOpenDialog(true);
    };

    // Löschvorgang bestätigen
    const handleConfirmDelete = async () => {
        if (!selectedFilmId) return;

        const success = await deleteFilm(selectedFilmId.toString());
        if (success) {
            // Nach dem Löschen erneut laden und Seite zurücksetzen
            setPage(0);
            loadFilms();
        } else {
            alert('Löschen fehlgeschlagen');
        }
        setOpenDialog(false);
        setSelectedFilmId(null);
    };

    // Seitenwechsel in der Pagination
    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    // Client-seitige Filterung nach Titel (case-insensitive)
    const filteredFilms = films.filter(film =>
        film.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Filme
            </Typography>

            {/* Suchfeld und Buttons */}
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <TextField
                    label="Suche nach Titel"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                {/* Setzt Seite zurück, damit immer von vorne gesucht wird */}
                <Button variant="contained" onClick={() => setPage(0)}>
                    Search
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setSearchTerm('');
                        setPage(0);
                    }}
                >
                    Clear
                </Button>
            </Stack>

            <Stack direction="row" spacing={2} mb={2} alignItems="center">
                <Button component={Link} to="/film/neu" variant="contained" color="success">
                    Neuen Film erstellen
                </Button>
            </Stack>

            <Paper>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader aria-label="Filmtabelle">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Titel</TableCell>
                                <TableCell>Jahr</TableCell>
                                <TableCell>Beschreibung</TableCell>
                                <TableCell>Bewertung</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredFilms.length > 0 ? (
                                // Pagination auf gefilterten Daten
                                filteredFilms
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map(film => (
                                        <TableRow key={film.film_id}>
                                            <TableCell>{film.film_id}</TableCell>
                                            <TableCell>{film.title}</TableCell>
                                            <TableCell>{film.release_year}</TableCell>
                                            <TableCell>{film.description}</TableCell>
                                            <TableCell>{film.rating}</TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    <Button
                                                        component={Link}
                                                        to={`/film/details/${film.film_id}`}
                                                        variant="outlined"
                                                        size="small"
                                                    >
                                                        Details
                                                    </Button>
                                                    <Button
                                                        component={Link}
                                                        to={`/film/${film.film_id}`}
                                                        variant="contained"
                                                        size="small"
                                                    >
                                                        Bearbeiten
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => confirmDelete(film.film_id as number)}
                                                    >
                                                        Löschen
                                                    </Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        Keine Filme gefunden
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination an gefilterter Länge ausrichten */}
                <TablePagination
                    component="div"
                    count={filteredFilms.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10]}
                />
            </Paper>

            {/* Bestätigungsdialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">Film löschen</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Möchtest du diesen Film wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Abbrechen
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                        Löschen
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default FilmPage;
