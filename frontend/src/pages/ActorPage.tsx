// src/pages/ActorPage.tsx
// noinspection JSUnusedLocalSymbols

import { useEffect, useState } from 'react';
import { getAllActors } from "../service/ActorService";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress } from "@mui/material";
import { Actor } from "../types/types";
import { NavLink } from "react-router";
import Button from "@mui/material/Button";

/**
 * ActorPage Component - Zeigt eine Tabelle aller verfügbaren Schauspieler an
 *
 * Diese Komponente ruft beim Laden alle Schauspieler vom Server ab und stellt sie
 * in einer Tabelle dar. Sie bietet auch Links zu Detail- und Bearbeitungsseiten
 * für jeden Schauspieler sowie einen Button zum Anlegen neuer Schauspieler.
 *
 * @example
 * <ActorPage />
 *
 * @returns {JSX.Element} Die gerenderte Schauspielerübersichtsseite
 */
const ActorPage = () => {
    const [actors, setActors] = useState<Actor[] | undefined>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        getActors();
    }, []);

    /**
     * Ruft alle Schauspieler vom Server ab und aktualisiert den State
     *
     * @async
     * @function getActors
     * @example
     * await getActors();
     *
     * @returns {Promise<void>}
     */
    async function getActors() {
        try {
            setLoading(true);
            const tempActors = await getAllActors();
            console.log("Got actors from server: ", tempActors);
            setActors(tempActors);
        } catch (error) {
            console.error("Fehler beim Abrufen der Schauspieler:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Schauspieler
            </Typography>
            <Button
                component={NavLink}
                to="/actor-create"
                variant="contained"
                sx={{ mb: 2 }} // etwas Abstand nach unten
            >
                Neuen Schauspieler anlegen
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="actor table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Vorname</TableCell>
                            <TableCell>Nachname</TableCell>
                            <TableCell>Aktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : actors && actors.length > 0 ? (
                            actors.map((actor) => (
                                <TableRow
                                    key={actor.actor_id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">{actor.actor_id}</TableCell>
                                    <TableCell>{actor.first_name}</TableCell>
                                    <TableCell>{actor.last_name}</TableCell>
                                    <TableCell>
                                        <NavLink to={`/actor/${actor.actor_id}`}>Details</NavLink>
                                        {" | "}
                                        <NavLink to={`/actor-edit/${actor.actor_id}`}>Bearbeiten</NavLink>
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
