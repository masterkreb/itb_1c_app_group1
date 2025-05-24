import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getActorById, deleteActor } from '../service/ActorService';
import { Actor } from '../types/types';
import { Typography, Stack, Paper, Table, TableBody, TableCell, TableRow, Button } from '@mui/material';

const ActorDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [actor, setActor] = useState<Actor | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchActorDetails = async () => {
            if (id) {
                const data = await getActorById(id);
                if (data) {
                    setActor(data);
                }
            }
            setIsLoading(false);
        };

        fetchActorDetails();
    }, [id]);

    const handleDelete = async () => {
        if (id && window.confirm('Möchten Sie diesen Schauspieler wirklich löschen?')) {
            const success = await deleteActor(id);
            if (success) {
                alert('Schauspieler erfolgreich gelöscht.');
                navigate('/actor');
            } else {
                alert('Fehler beim Löschen des Schauspielers.');
            }
        }
    };

    if (isLoading) {
        return <Typography>Lädt...</Typography>;
    }

    if (!actor) {
        return <Typography>Schauspieler nicht gefunden.</Typography>;
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Schauspieler Details
            </Typography>
            <Paper elevation={3} style={{ padding: '16px' }}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell>{actor.actor_id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Vorname</strong></TableCell>
                            <TableCell>{actor.first_name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Nachname</strong></TableCell>
                            <TableCell>{actor.last_name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Filme</strong></TableCell>
                            <TableCell>
                                {actor.films?.length ? (
                                    actor.films.map(film => (
                                        <span key={film.film_id}>
                                            {film.title}
                                            <br />
                                        </span>
                                    ))
                                ) : (
                                    'Keine Filme zugeordnet'
                                )}
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
                    to={`/actor/${id}`}
                >
                    Bearbeiten
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    component={Link}
                    to="/actor/neu"
                >
                    Neuen Schauspieler erstellen
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
                    color="secondary"
                    onClick={() => navigate('/actor')}
                >
                    Zurück
                </Button>
            </Stack>
        </div>
    );
};

export default ActorDetails;
