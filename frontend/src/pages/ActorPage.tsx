// frontend/src/pages/ActorPage.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';                     // ← statt NavLink von "react-router"
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
    Typography
} from '@mui/material';

const ActorPage: React.FC = () => {
    // State für Schauspieler-Liste
    const [actors, setActors] = useState<Actor[]>([]);

    // Lädt alle Schauspieler
    const loadActors = async () => {
        const data = await getAllActors();
        if (data) setActors(data);
    };

    useEffect(() => {
        loadActors();
    }, []);

    // Handler zum Löschen
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

    return (
        <div>
            {/* Überschrift */}
            <Typography variant="h4" gutterBottom>
                Schauspieler
            </Typography>

            {/* Button zum Anlegen */}
            <Stack direction="row" spacing={2} mb={2}>
                <Button component={Link} to="/actor/new" variant="contained">
                    Neuer Schauspieler
                </Button>
            </Stack>

            {/* Tabelle */}
            <TableContainer component={Paper}>
                <Table aria-label="Actortabelle">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Vorname</TableCell>
                            <TableCell>Nachname</TableCell>
                            <TableCell align="right">Aktionen</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {actors.length > 0 ? (
                            actors.map(actor => (
                                <TableRow key={actor.actor_id}>
                                    <TableCell>{actor.actor_id}</TableCell>
                                    <TableCell>{actor.first_name}</TableCell>
                                    <TableCell>{actor.last_name}</TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            {/* Details/Edit */}
                                            <Button
                                                component={Link}
                                                to={`/actor/${actor.actor_id}`}
                                                variant="outlined"
                                                size="small"
                                            >
                                                Details
                                            </Button>
                                            {/* Löschen */}
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
                                    Keine Schauspieler vorhanden
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ActorPage;
