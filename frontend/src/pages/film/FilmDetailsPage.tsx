// noinspection JSUnusedLocalSymbols

// @ts-ignore
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";
import { deleteFilm, getFilmById } from "../../service/FilmService.ts"; // Film-Service importieren
import {
    Button,
    Typography,
    TableContainer,
    Paper,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead
} from '@mui/material';

const FilmDetailsPage = () => {
    const { id } = useParams(); // ID von der URL holen
    const [film, setFilm] = useState<any>(null); // Film wird gespeichert
    const navigate = useNavigate(); // für Weiterleitung

    const handleEdit = () => {
        navigate(`/film/edit/${film.film_id}`); // zur Bearbeiten-Seite
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Willst du diesen Film wirklich löschen?");
        if (confirmDelete && film) {
            const success = await deleteFilm(film.film_id.toString());
            if (success) {
                navigate("/film"); // Zurück zur Übersicht
            } else {
                alert("Löschen fehlgeschlagen.");
            }
        }
    }; // Film löschen mit Bestätigung

    useEffect(() => {
        if (id) {
            getFilmById(id).then((data) => {
                if (data) {
                    setFilm(data); // Film-Daten speichern
                }
            });
        }
    }, [id]);

    if (!film) {
        return <div>Film wird geladen...</div>; // Wenn noch kein Film vorhanden ist
    }

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Details zu Film #{film.film_id}
            </Typography>

            <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Titel</TableCell>
                            <TableCell>Beschreibung</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Schauspieler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{film.film_id}</TableCell>
                            <TableCell>{film.title}</TableCell>
                            <TableCell>{film.description}</TableCell>
                            <TableCell>{film.rating}</TableCell>
                            <TableCell>
                                {film.actors?.map((a: any) => a.first_name + " " + a.last_name).join(", ")}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <Button variant="contained" color="success" onClick={() => navigate("/film/create")}>+ Neuer Film</Button>
                <Button variant="contained" color="primary" onClick={handleEdit}>... Bearbeiten</Button>
                <Button variant="contained" color="error" onClick={handleDelete}>X Löschen</Button>
            </div>
        </div>
    );
};

export default FilmDetailsPage;
