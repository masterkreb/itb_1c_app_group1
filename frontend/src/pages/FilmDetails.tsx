import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getFilmById } from '../service/FilmService';
import { Film } from '../types/types';
import { Typography, Stack, Paper, Table, TableBody, TableCell, TableRow, Button } from '@mui/material';

const FilmDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [film, setFilm] = useState<Film | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchFilmDetails = async () => {
            if (id) {
                const data = await getFilmById(id);
                if (data) {
                    setFilm(data);
                }
            }
            setIsLoading(false);
        };

        fetchFilmDetails();
    }, [id]);

    if (isLoading) {
        return <Typography>Lädt...</Typography>;
    }

    if (!film) {
        return <Typography>Film nicht gefunden.</Typography>;
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Film Details
            </Typography>
            <Paper elevation={3} style={{ padding: '16px' }}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell>{film.film_id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Titel</strong></TableCell>
                            <TableCell>{film.title}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Beschreibung</strong></TableCell>
                            <TableCell>{film.description}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Erscheinungsjahr</strong></TableCell>
                            <TableCell>{film.release_year}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Ausleihdauer</strong></TableCell>
                            <TableCell>{film.rental_duration}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Ausleihgebühr</strong></TableCell>
                            <TableCell>{film.rental_rate}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Länge</strong></TableCell>
                            <TableCell>{film.length} Minuten</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Ersatzkosten</strong></TableCell>
                            <TableCell>{film.replacement_cost}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Bewertung</strong></TableCell>
                            <TableCell>{film.rating}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Besondere Features</strong></TableCell>
                            <TableCell>{film.special_features}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Schauspieler</strong></TableCell>
                            <TableCell>
                                {film.actors?.map(actor => (
                                    <span key={actor.actor_id}>
                                        {actor.first_name} {actor.last_name}
                                        <br />
                                    </span>
                                )) || 'Keine Schauspieler zugeordnet'}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>

            <Stack direction="row" spacing={2} marginTop={2}>
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/film/${id}`}
                >
                    Bearbeiten
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    component={Link}
                    to="/film/new"
                >
                    Neuen Film
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/film')}
                >
                    Zurück
                </Button>
            </Stack>
        </div>
    );
};

export default FilmDetails;
