// frontend/src/pages/ActorPage.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllActors, deleteActor } from '../service/ActorService';
import { Actor } from '../types/types';
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
} from '@mui/material';

const ActorPage: React.FC = () => {
    const [actors, setActors] = useState<Actor[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;

    const loadActors = async () => {
        const data = await getAllActors();
        if (data) setActors(data);
    };

    useEffect(() => {
        loadActors();
    }, []);

    const handleDelete = async (id?: number) => {
        if (!id) return;
        if (!window.confirm(`Schauspieler ${id} wirklich löschen?`)) return;
        const success = await deleteActor(id.toString());
        if (success) {
            loadActors();
        } else {
            alert('Löschen fehlgeschlagen');
        }
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const filteredActors = actors.filter(actor =>
        `${actor.first_name} ${actor.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Schauspieler
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <TextField
                    label="Search by name"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <Button variant="contained" onClick={() => loadActors()}>
                    Neu Laden
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

            <Stack direction="row" spacing={2} mb={2}>
                <Button component={Link} to="/actor/neu" variant="contained" color="success">
                    Neuer Schauspieler
                </Button>
            </Stack>

            <Paper>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader aria-label="Actortabelle">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Vorname</TableCell>
                                <TableCell>Nachname</TableCell>
                                <TableCell align="right">Aktionen</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredActors.length > 0 ? (
                                filteredActors
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map(actor => (
                                        <TableRow key={actor.actor_id}>
                                            <TableCell>{actor.actor_id}</TableCell>
                                            <TableCell>{actor.first_name}</TableCell>
                                            <TableCell>{actor.last_name}</TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    <Button
                                                        component={Link}
                                                        to={`/actor/details/${actor.actor_id}`}
                                                        variant="outlined"
                                                        size="small"
                                                    >
                                                        Details
                                                    </Button>
                                                    <Button
                                                        component={Link}
                                                        to={`/actor/${actor.actor_id}`}
                                                        variant="contained"
                                                        size="small"
                                                    >
                                                        Bearbeiten
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleDelete(actor.actor_id)}
                                                    >
                                                        Löschen
                                                    </Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        Keine Schauspieler gefunden
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={filteredActors.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10]}
                />
            </Paper>
        </div>
    );
};

export default ActorPage;
