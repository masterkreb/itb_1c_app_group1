// noinspection JSUnusedLocalSymbols

// @ts-ignore
import React, { useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router';
import { getActorById } from '../../service/ActorService.ts';
import { deleteActor } from "../../service/ActorService.ts";
import { Actor } from '../../types/types.ts';
import {Button, Typography, TableContainer, Paper, Table, TableBody, TableRow, TableCell, TableHead} from '@mui/material';

/**
 * Rendert Actor Page und ist im Router dem path /actor/:id zugewiesen wird.
 * @returns:
 * - Eine Tabelle mit den Daten von einem Schauspieler inkl. ID, Vorname, Nachname und den verknüpften Filmen.
 * - Drei Button, zum Bearbeiten, Löschen und um einen neuen Schauspieler anzulegen.
 * useParams holt die ID aus der URL um den Schauspieler aus dem Server zu laden.
 * @state actor: Speichert die Daten des aktuell ausgewählten Schauspielers.
 */
const ActorDetailsPage = () => {
    const { id } = useParams();
    const [actor, setActor] = useState<Actor | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            getActorById(id).then((data) => {
                if (data) {
                    setActor(data);
                }
            });
        }
    }, [id]);

    /**
     * Navigiert zur edit-Page, ist hinter dem Bearbeiten Button hinterlegt
     */
    const handleEdit = () => {
        navigate(`/actor/edit/${actor?.actor_id}`);
    };

    /**
     * Löst die deleteActor Funktion für die aktuelle ID aus, wenn jemand auf Löschen klickt.
     * Bei erfolgreichem Löschen kehrt man zur actor-Page zurück, ansonsten erscheint eine Fehlermeldung
     */
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Willst du diesen Schauspieler wirklich löschen?");
        if (confirmDelete && actor) {
            const success = await deleteActor(actor.actor_id.toString());
            if (success) {
                navigate("/actor");
            } else {
                alert("Löschen fehlgeschlagen.");
            }
        }
    };

    /**
     * Navigiert zur new-Page um Schauspieler zu erfassen, ist hinter dem Neuer Schauspieler Button hinterlegt
     */
    const handleNew = () => {
        navigate("/actor/new");
    };

    /**
     * Erscheint, wenn zu einer ID kein Schauspieler gefunden wird
     */
    if (!actor) {
        return <div>Schauspieler nicht gefunden...</div>;
    }

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Details zu Schauspieler #{actor.actor_id}
            </Typography>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Vorname</TableCell>
                            <TableCell>Nachname</TableCell>
                            <TableCell>Filme</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{actor.actor_id}</TableCell>
                            <TableCell>{actor.first_name}</TableCell>
                            <TableCell>{actor.last_name}</TableCell>
                            <TableCell>
                                {actor.films?.map((f: any) => f.title).join(", ")}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <Button variant="contained" color="primary" onClick={handleEdit}>
                    Bearbeiten
                </Button>
                <Button variant="contained" color="error" onClick={handleDelete}>
                    Löschen
                </Button>
                <Button variant="contained" color="success" onClick={handleNew}>
                    Neuer Schauspieler
                </Button>
            </div>
        </div>
    );
};

export default ActorDetailsPage;