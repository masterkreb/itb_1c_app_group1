// noinspection JSUnusedLocalSymbols

import React, {useEffect} from 'react';
import {NavLink, useNavigate} from "react-router";
import {getActorById, getAllActors} from "../../service/ActorService.ts";
import {Actor} from "../../types/types.ts";
import {Button, Paper, Table, TableBody, TableContainer, TableHead, TableRow, TextField, TableCell} from "@mui/material";

/**
 * Rendert Actor Page und ist im Router dem path /actor zugewiesen wird.
 * @returns:
 * - Eine Tabelle aller Schauspieler inkl. ID, Vorname, Nachname und den verknüpften Filmen.
 * - Eine Suchleiste mit Button um einen bestimmten Schauspieler über die ID zu öffnen.
 * - Einen Button um einen neuen Schauspieler zu erfassen (navigiert zu /actor/new).
 * @state actors: Speichert eine Liste aller Actor Objekte.
 * @state searchId: Überblickt den User Input in der Suchleiste.
 */
const ActorPage = () => {
    const [actors, setActors] = React.useState<Actor[] | undefined>();
    const [searchId, setSearchId] = React.useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getActors();
    }, [])

    /**
     * Ladet alle Schauspieler aus der Datenbank
     */
    async function getActors() {
        const tempActors = await getAllActors();
        setActors(tempActors);
    }

    /**
     * Bearbeitet das Suchfeld, wenn jemand im Suchfeld eine ID eingibt, wird diese ID gesucht und die Detail-Seite geöffnet.
     * Wenn die ID nicht gefunden wird, tritt ein Fehler auf.
     */
    const handleSearch = async () => {
        if (!searchId.trim()) return;

        const actor = await getActorById(searchId);
        if (actor) {
            navigate(`/actor/${searchId}`);
        } else {
            alert("Schauspieler mit dieser ID wurde nicht gefunden.");
        }
    };

    return (
        <div>
            <h2>Actor Page</h2>

            <div style={{ margin: "20px 20px 30px 0", display: "flex", gap: "15px", alignItems: "center" }}>

                <TextField
                    placeholder="Actor ID eingeben"
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
                    onClick={() => navigate("/actor/new")}
                >
                    Neuer Schauspieler
                </Button>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Vorname</TableCell>
                            <TableCell>Nachname</TableCell>
                            <TableCell>Filme</TableCell>
                            <TableCell>Aktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {actors ? (
                                actors.map((row) => (
                                    <TableRow
                                        key={row.actor_id}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell component="th" scope="row">{row.actor_id}</TableCell>
                                        <TableCell component="th" scope="row">{row.first_name}</TableCell>
                                        <TableCell>{row.last_name}</TableCell>
                                        <TableCell>
                                            {row.films?.map((f: any) => f.title).join(", ")}
                                        </TableCell>
                                        <TableCell><NavLink to={"/actor/"+row.actor_id}>Details</NavLink></TableCell>
                                    </TableRow>
                                ))
                            )
                            : <TableRow>
                                <TableCell>Schauspieler laden...</TableCell>
                            </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ActorPage;