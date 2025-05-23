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
    Typography
} from '@mui/material';

const FilmPage: React.FC = () => {
    // Alle Filme
    const [films, setFilms] = useState<Film[]>([]);
    // Suchbegriff für Title-Filter
    const [searchTerm, setSearchTerm] = useState<string>('');

    /**
     * Lädt Filme vom Server.
     * Wird ohne Parameter aufgerufen => alle Filme
     * Wird mit searchTerm aufgerufen => nur Titel, die so beginnen
     */
    const loadFilms = async (filter?: string) => {
        const data = await getAllFilms(filter);
        if (data) {
            setFilms(data);
        }
    };

    // Beim ersten Render ohne Filter laden
    useEffect(() => {
        loadFilms();
    }, []);

    /**
     * Löscht einen Film und lädt danach erneut (mit aktuellem Filter).
     */
    const handleDelete = async (id?: number) => {
        if (!id) return;
        // Sicherheitsabfrage
        if (!window.confirm(`Film ${id} wirklich löschen?`)) return;

        const success = await deleteFilm(id.toString());
        if (success) {
            // Nach dem Löschen mit dem aktuellen Suchbegriff neu laden
            loadFilms(searchTerm);
        } else {
            alert('Löschen fehlgeschlagen');
        }
    };

    return (
        <div>
            {/* Überschrift */}
            <Typography variant="h4" gutterBottom>
                Filme
            </Typography>


            {/* Suchleiste */}
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <TextField
                    label="Search by title"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <Button
                    variant="contained"
                    onClick={() => loadFilms(searchTerm)}  // Filter anwenden
                >
                    Search
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setSearchTerm('');  // Suchbegriff zurücksetzen
                        loadFilms();        // alle Filme neu laden
                    }}
                >
                    Clear
                </Button>
            </Stack>
            {/* Button für neuen Film */}
            <Stack direction="row" spacing={2} mb={2} alignItems="center">
                <Button
                    component={Link}
                    to="/film/neu"
                    variant="contained"
                    color="success"
                >
                    Neuen Film erstellen
                </Button>
            </Stack>

            {/* Tabelle */}
            <TableContainer component={Paper}>
                <Table aria-label="Filmtabelle">
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
                            films.map(film => (
                                <TableRow key={film.film_id}>
                                    <TableCell>{film.film_id}</TableCell>
                                    <TableCell>{film.title}</TableCell>
                                    <TableCell>{film.release_year}</TableCell>
                                    <TableCell>{film.description}</TableCell>
                                    <TableCell>{film.rating}</TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            {/* Details-Navigation */}
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
                                            {/* Löschen */}
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                onClick={() => handleDelete(film.film_id)}
                                            >
                                                Löschen
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            // Falls keine Filme (oder kein Treffer beim Filter)
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    Keine Filme gefunden
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
