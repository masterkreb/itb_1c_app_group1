// noinspection JSUnusedLocalSymbols

import {useEffect, useState} from 'react';
import {getAllFilms} from "../service/FilmService.ts";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress} from "@mui/material";
import {Film} from "../types/types.ts";
import {NavLink} from "react-router";
import Button from "@mui/material/Button";

// noinspection JSUnusedLocalSymbols


/**
 * FilmPage Component - Zeigt eine Tabelle aller verfügbaren Filme an
 *
 * Diese Komponente ruft beim Laden alle Filme vom Server ab und stellt sie
 * in einer Tabelle dar. Sie bietet auch Links zu Detail- und Bearbeitungsseiten
 * für jeden Film sowie einen Button zum Anlegen neuer Filme.
 *
 * @example
 * <FilmPage />
 *
 * @returns {JSX.Element} Die gerenderte Filmübersichtsseite
 */
const FilmPage = () => {
    const [films, setFilms] = useState<Film[] | undefined>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        getFilms();
    }, []);

    /**
     * Ruft alle Filme vom Server ab und aktualisiert den State
     *
     * @async
     * @function getFilms
     * @example
     * await getFilms();
     *
     * @returns {Promise<void>}
     */
    async function getFilms() {
        try {
            setLoading(true);
            const tempFilms = await getAllFilms();
            console.log("Got films from server: ", tempFilms);
            setFilms(tempFilms);
        } catch (error) {
            console.error("Fehler beim Abrufen der Filme:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Filme
            </Typography>
            <Button
                component={NavLink}
                to="/film-create"
                variant="contained"
                sx={{ mb: 2 }} // etwas Abstand nach unten
            >
                Neuen Film anlegen
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="film table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Titel</TableCell>
                            <TableCell>Preis</TableCell>
                            <TableCell>Dauer</TableCell>
                            <TableCell>Aktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : films && films.length > 0 ? (
                            films.map((row) => (
                                <TableRow
                                    key={row.film_id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">{row.film_id}</TableCell>
                                    <TableCell>{row.title}</TableCell>
                                    <TableCell>{row.rental_rate}</TableCell>
                                    <TableCell>{row.rental_duration}</TableCell>
                                    <TableCell>
                                        <NavLink to={`/film/${row.film_id}`}>Details</NavLink>
                                        {" | "}
                                        <NavLink to={`/film-edit/${row.film_id}`}>Bearbeiten</NavLink>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Keine Filme vorhanden
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default FilmPage;