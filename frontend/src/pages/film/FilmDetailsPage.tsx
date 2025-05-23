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
 * Rendert die Detail-Seite für ein einzelnes Filmobjekt.
 *
 * @returns:
 * - Eine Tabelle mit Film-Daten (ID, Titel, Beschreibung, Rating, Schauspieler).
 * - Drei Buttons: zum Bearbeiten, Löschen und für einen neuen Film.
 *
 * @state film - Speichert die geladenen Filmdaten.
 *
 * useParams holt die Film-ID aus der URL.
 * useNavigate wird für Weiterleitung verwendet.
 */
const FilmDetailsPage = () => {
    const { id } = useParams();
    const [film, setFilm] = useState<any>(null);
    const navigate = useNavigate();

    /**
     * Navigiert zur Bearbeitungsseite für den aktuellen Film.
     * Ist mit dem "Bearbeiten"-Button verknüpft.
     */
    const handleEdit = () => {
        navigate(`/film/edit/${film.film_id}`);
    };

    /**
     * Löst die deleteFilm Funktion für die aktuelle ID aus, wenn jemand auf Löschen klickt.
     * Bei erfolgreichem Löschen kehrt man zur film-Page zurück, ansonsten erscheint eine Fehlermeldung.
     */
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




    /**
     * Lädt die Filmdaten basierend auf der ID aus der URL.
     * Wenn keine Daten gefunden werden, bleibt `film` null.
     */

    useEffect(() => {
        if (id) {
            getFilmById(id).then((data) => {
                if (data) {
                    setFilm(data);
                }
            });
        }
    }, [id]);


    /**
     * Wenn der Film noch nicht geladen ist, zeigt eine Ladeanzeige.
     */

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
