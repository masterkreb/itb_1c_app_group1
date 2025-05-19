import React, {useEffect} from 'react';
import {getAllActors} from "../service/ActorService.ts";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";


import {NavLink} from "react-router";
import {Actor} from "../types/types.ts";

const ActorPage = () => {
    const [actors, setActor] = React.useState<Actor[] | undefined>();

    useEffect(() => {
        getActor();
    }, [])

    async function getActor() {
        const tempActor = await getAllActors();
        console.log("Got actors from server: ", tempActor);
        setActor(tempActor);
        console.log("Ending GetActors")
    }


    return (
        <div>
           Actor Page
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Nachname</TableCell>
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
                                        <TableCell align="right"><NavLink to={"/actor/"+row.actor_id}>Details</NavLink></TableCell>
                                    </TableRow>
                                ))
                            )
                            : <TableRow>
                                <TableCell>Keine Actor vorhanden</TableCell>
                            </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};



export default ActorPage;