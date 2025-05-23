// noinspection JSUnusedLocalSymbols

import React from "react";
import {getAllFilms, getFilmById} from "../../service/FilmService.ts";
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField} from "@mui/material";
import {NavLink, useNavigate} from "react-router";


/**
 * Rendert Film Page und ist im Router dem path /film zugewiesen wird.
 *
 * @returns:
 * - Eine Tabelle aller Filme inkl. ID, Titel und den verknüpften Schauspielern.
 * - Eine Suchleiste mit Button um einen bestimmten Film über die ID zu öffnen.
 * - Einen Button um einen neuen Film zu erfassen (navigiert zu /film/new).
 *
 * @state films - Speichert eine Liste aller Film Objekte.
 * @state searchId - Überblickt den User Input in der Suchleiste.
 */
const FilmPage = () => {
    const [films, setFilms] = React.useState<any[]>([]); // Liste von Filme, am Anfang leer

    // film ID zum Suchen
    const [searchId, setSearchId] = React.useState("");
    const navigate = useNavigate(); // für Weiterleitung

    /**
     * Lädt alle Filme vom Server bei Initialisierung der Seite.
     * Wird nur einmal beim Mounten der Komponente ausgeführt.
     */
    React.useEffect(() => {
        console.log("Film Page geladen"); // wenn Seite lädt
        getAllFilms().then((data) => {
            console.log("Filme vom Server:", data); // kontrol
            setFilms(data); // speichert Filme in State
        });

    }, []);

    /**
     * Sucht einen Film anhand der eingegebenen ID.
     * Wenn gefunden, wird zur Detail-Seite dieses Films navigiert.
     * Wenn nicht gefunden, erscheint eine Fehlermeldung.
     */
        // Film ID mit Server prüfen
    const handleSearch = async () => {
        if (!searchId.trim()) return;

        const film = await getFilmById(searchId);
        if (film) {
            navigate(`/film/${searchId}`);
        } else {
            alert("Film mit dieser ID wurde nicht gefunden.");
        }
    };

    return (
        <div>
            <h2>Film Page</h2>

            {/* Film erstellen + Film suchen */}
            <div style={{ margin: "20px 20px 30px 0", display: "flex", gap: "15px", alignItems: "center" }}>


                <TextField
                    placeholder="Film ID eingeben"
                    inputMode="numeric"
                    variant="standard"
                    value={searchId}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {
                            setSearchId(val);
                        }
                    }}
                />

                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleSearch}
                >
                    Suchen
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    onClick={() => navigate("/film/new")}
                >
                    Neuer Film
                </Button>
            </div>


            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Titel</TableCell>

                            <TableCell>Actors</TableCell>
                            <TableCell>Aktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {films && films.length > 0 ? (

                                films.map((row) => (
                                    <TableRow
                                        key={row.film_id}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell component="th" scope="row">{row.film_id}</TableCell>
                                        <TableCell component="th" scope="row">{row.title}</TableCell>

                                        <TableCell>
                                            {row.actors &&
                                            row.actors.filter((a: any) => a.first_name && a.last_name).length > 0
                                                ? row.actors
                                                    .filter((a: any) => a.first_name && a.last_name)
                                                    .map((a: any) => a.first_name + " " + a.last_name)
                                                    .join(", ")
                                                : "Keine Schauspieler vorhanden"}
                                        </TableCell>


                                        <TableCell align="right"><NavLink to={"/film/"+row.film_id}>Details</NavLink></TableCell>
                                    </TableRow>
                                ))
                            )
                            : <TableRow>
                                <TableCell colSpan={5}>Keine Filme vorhanden</TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default FilmPage;
