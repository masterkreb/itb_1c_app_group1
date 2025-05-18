import React from "react";
import {getAllFilms} from "../service/FilmService.ts";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {NavLink} from "react-router";

const FilmPage = () => {
    const [films, setFilms] = React.useState<any[]>([]); // Liste von Filme, am Anfang leer


    React.useEffect(() => {
        console.log("Film Page geladen"); // wenn Seite lädt
        getAllFilms().then((data) => {
            console.log("Filme vom Server:", data); // kontrol
            setFilms(data); // speichert Filme in State
        });

    }, []);


    return (
        <div>
            Film Page

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Titel</TableCell>
                            <TableCell>Beschreibung</TableCell>
                            <TableCell>Actors</TableCell>

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
                                        <TableCell>{row.description}</TableCell>
                                        <TableCell>
                                            {row.actors && row.actors.length > 0
                                                ? row.actors.map((a: any) => a.first_name + " " + a.last_name).join(", ")
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
