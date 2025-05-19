// noinspection JSUnusedLocalSymbols

// @ts-ignore
import React, { useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router';
import { getActorById } from '../../service/ActorService.ts';
import { deleteActor } from "../../service/ActorService.ts";
import { Actor } from '../../types/types.ts';
import {
    Button,
    Typography,
    TableContainer,
    Paper,
    Table,
    TableBody,
    TableRow,
    TableCell, TableHead
} from '@mui/material';

const ActorDetailsPage = () => {
    const { id } = useParams();
    const [actor, setActor] = useState<Actor | null>(null);
    const navigate = useNavigate();
    console.log("Param actorId:", id);

    useEffect(() => {
        if (id) {
            getActorById(id).then((data) => {
                if (data) {
                    setActor(data);
                }
            });
        }
    }, [id]);

    const handleEdit = () => {
        navigate(`/actor/edit/${actor?.actor_id}`);
    };
    console.log(actor)
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

    const handleNew = () => {
        navigate("/actor/new");
    };


    if (!actor) {
        return <div>Schauspieler wird geladen...</div>;
    }

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Details zu Schauspieler #{actor.actor_id}
            </Typography>

            <TableContainer component={Paper} sx={{ maxWidth: 500 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Vorname</TableCell>
                            <TableCell>Nachname</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{actor.actor_id}</TableCell>
                            <TableCell>{actor.first_name}</TableCell>
                            <TableCell>{actor.last_name}</TableCell>
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
                <Button variant="outlined" onClick={handleNew}>
                    Neuer Schauspieler
                </Button>
            </div>
        </div>
    );
};

export default ActorDetailsPage;