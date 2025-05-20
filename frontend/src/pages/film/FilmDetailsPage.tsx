// noinspection JSUnusedLocalSymbols

// @ts-ignore
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";
import {deleteFilm, getFilmById} from "../../service/FilmService.ts"; // Film-Service importieren
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

/**
 * Funktion die die Detail-Seite eines Films rendert.
 *
 * @returns:
 * - Zeigt Filminformationen (ID, Titel, Beschreibung, Rating, Schauspieler).
 * - Bietet Buttons für Bearbeiten, Löschen und neuen Film erfassen.
 *
 * State Variablen:
 * - `film`: Speichert das aktuelle Filmobjekt.
 */

const FilmDetailsPage = () => {
    const {id} = useParams();
    const [film, setFilm] = useState<any>(null);
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/film/edit/${film.film_id}`);
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Willst du diesen Film wirklich löschen?");
        if (confirmDelete && film) {
            const success = await deleteFilm(film.film_id.toString());
            if (success) {
                navigate("/film");
            } else {
                alert("Löschen fehlgeschlagen.");
            }
        }
    };





    useEffect(() => {
        if (id) {
            getFilmById(id).then((data) => {
                if (data) {
                    setFilm(data);
                }
            });
        }
    }, [id]);

    if (!film) {
        return <div>Film wird geladen...</div>;
    }

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Details zu Film #{film.film_id}
            </Typography>

            <TableContainer component={Paper}>
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

            <div style={{marginTop: "20px", display: "flex", gap: "10px"}}>
                <Button variant="contained" color="primary" onClick={handleEdit}>Bearbeiten</Button>
                <Button variant="contained" color="error" onClick={handleDelete}>Löschen</Button>
                <Button variant="contained" color="success" onClick={() => navigate("/film/new")}>Neuer Film</Button>
            </div>
        </div>
    );
};

export default FilmDetailsPage;
