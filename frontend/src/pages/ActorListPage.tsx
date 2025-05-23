// src/pages/ActorListPage.tsx
import React, { useEffect, useState } from "react";
import { getAllActors } from "../services/ActorService";
import { Actor } from "../types/types";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Stack, Typography, CircularProgress, IconButton, Tooltip
} from "@mui/material";
import { NavLink, useNavigate } from "react-router";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

/**
 * ActorListPage – Zeigt eine übersichtliche Liste aller Schauspieler mit Aktionen.
 * REST-konform, mit Fehlerbehandlung, Navigationsbutton und sauberem Layout.
 * 
 * @returns React-Komponente
 */
const ActorListPage: React.FC = () => {
    const [actors, setActors] = useState<Actor[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadActors();
    }, []);

    /**
     * Holt alle Schauspieler aus dem Backend.
     */
    async function loadActors() {
        setLoading(true);
        try {
            const data = await getAllActors();
            setActors(data);
            setError(null);
        } catch (err: any) {
            setError("Schauspieler konnten nicht geladen werden.");
            setActors([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h4">Schauspieler verwalten</Typography>
                    <Tooltip title="Aktualisieren">
                        <IconButton onClick={loadActors} color="primary">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/actor/new")}
                >
                    Neuen Schauspieler anlegen
                </Button>
            </Stack>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Vorname</TableCell>
                            <TableCell>Nachname</TableCell>
                            <TableCell align="right">Aktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    <CircularProgress size={24} />
                                    <Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>
                                        Lade Schauspieler...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ color: "error.main", py: 2 }}>
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : actors.length > 0 ? (
                            actors.map((actor) => (
                                <TableRow key={actor.actor_id} hover>
                                    <TableCell>{actor.actor_id}</TableCell>
                                    <TableCell>{actor.first_name}</TableCell>
                                    <TableCell>{actor.last_name}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Details anzeigen">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                component={NavLink}
                                                to={`/actor/${actor.actor_id}`}
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Bearbeiten">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                component={NavLink}
                                                to={`/actor/${actor.actor_id}/edit`}
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
                                <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
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

export default ActorListPage;