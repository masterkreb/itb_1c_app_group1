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
    const [films, setFilms] = useState<Film[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;

    // Dialog State
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFilmId, setSelectedFilmId] = useState<number | null>(null);

    const loadFilms = async (filter?: string) => {
        const data = await getAllFilms(filter);
        if (data) {
            setFilms(data);
        }
    };

    useEffect(() => {
        loadFilms();
    }, []);

    const confirmDelete = (id: number) => {
        setSelectedFilmId(id);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedFilmId) return;

        const success = await deleteFilm(selectedFilmId.toString());
        if (success) {
            loadFilms(searchTerm);
        } else {
            alert('Löschen fehlgeschlagen');
        }
        setOpenDialog(false);
        setSelectedFilmId(null);
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Filme
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <TextField
                    label="Search by title"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <Button variant="contained" onClick={() => loadFilms(searchTerm)}>
                    Search
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setSearchTerm('');
                        loadFilms();
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
                            {films.length > 0 ? (
                                films
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

                <TablePagination
                    component="div"
                    count={films.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10]}
                />
            </Paper>

            {/* MUI Bestätigungsdialog */}
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
