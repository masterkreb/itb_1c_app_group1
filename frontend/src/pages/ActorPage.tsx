"use client"

import { useEffect, useState } from "react"
import type { Actor } from "../types/types.ts"
import { getAllActors } from "../service/ActorService.ts"
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    Stack,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material"

const ActorPage = () => {
    const [actors, setActors] = useState<Actor[]>([])
    const [selectedActor, setSelectedActor] = useState<Actor | null>(null)
    const [showViewDialog, setShowViewDialog] = useState<boolean>(false)
    const [showEditDialog, setShowEditDialog] = useState<boolean>(false)
    const [showAddDialog, setShowAddDialog] = useState<boolean>(false)
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")

    // Actors laden
    useEffect(() => {
        getAllActors()
            .then((actorData) => {
                if (actorData) {
                    setActors(actorData)
                }
            })
            .catch((error) => console.error("Fehler beim Laden der Schauspieler:", error))
    }, [])

    const handleView = (actor: Actor) => {
        setSelectedActor(actor)
        setShowViewDialog(true)
    }

    const handleEdit = (actor: Actor) => {
        setSelectedActor(actor)
        setFirstName(actor.first_name)
        setLastName(actor.last_name)
        setShowEditDialog(true)
    }

    const handleAdd = () => {
        setFirstName("")
        setLastName("")
        setShowAddDialog(true)
    }

    const handleSave = () => {
        console.log("Speichern:", { firstName, lastName })
        // Hier würdest du die Update-Logik implementieren
        setShowEditDialog(false)
        // Actors neu laden
    }

    const handleCreate = () => {
        console.log("Erstellen:", { firstName, lastName })
        // Hier würdest du die Create-Logik implementieren
        setShowAddDialog(false)
        // Actors neu laden
    }

    const handleDelete = (actor: Actor) => {
        if (confirm(`Schauspieler ${actor.first_name} ${actor.last_name} wirklich löschen?`)) {
            console.log("Löschen:", actor)
            // Hier würdest du die Delete-Logik implementieren
            // Actors neu laden
        }
    }

    const closeDialogs = () => {
        setShowViewDialog(false)
        setShowEditDialog(false)
        setShowAddDialog(false)
        setSelectedActor(null)
    }

    return (
        <div>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <h2>Schauspielerliste</h2>
                <Button variant="contained" onClick={handleAdd}>
                    Neuen Schauspieler hinzufügen
                </Button>
            </Stack>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Vorname</TableCell>
                            <TableCell>Nachname</TableCell>
                            <TableCell>Aktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {actors.map((actor) => (
                            <TableRow key={`actor-${actor.actor_id}`}>
                                <TableCell>{actor.actor_id}</TableCell>
                                <TableCell>{actor.first_name}</TableCell>
                                <TableCell>{actor.last_name}</TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        <Button size="small" onClick={() => handleView(actor)}>
                                            Ansehen
                                        </Button>
                                        <Button size="small" onClick={() => handleEdit(actor)}>
                                            Bearbeiten
                                        </Button>
                                        <Button size="small" color="error" onClick={() => handleDelete(actor)}>
                                            Löschen
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog für Ansehen */}
            <Dialog open={showViewDialog} onClose={closeDialogs} maxWidth="md" fullWidth>
                <DialogTitle>Schauspieler Details</DialogTitle>
                <DialogContent>
                    {selectedActor && (
                        <Card>
                            <CardContent>
                                <Typography variant="h6">
                                    {selectedActor.first_name} {selectedActor.last_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ID: {selectedActor.actor_id}
                                </Typography>

                                <h4>Filme:</h4>
                                {selectedActor.films && selectedActor.films.length > 0 ? (
                                    <List>
                                        {selectedActor.films.map((film) => (
                                            <ListItem key={`film-${film.film_id}`}>
                                                <Card sx={{ width: "100%" }}>
                                                    <CardContent>
                                                        <Typography variant="h6">{film.title}</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {film.description}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography>Keine Filme verfügbar</Typography>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog für Bearbeiten */}
            <Dialog open={showEditDialog} onClose={closeDialogs} maxWidth="sm" fullWidth>
                <DialogTitle>Schauspieler bearbeiten</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField label="Vorname" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
                        <TextField label="Nachname" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button variant="contained" onClick={handleSave}>
                                Speichern
                            </Button>
                            <Button variant="outlined" onClick={closeDialogs}>
                                Abbrechen
                            </Button>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>

            {/* Dialog für Hinzufügen */}
            <Dialog open={showAddDialog} onClose={closeDialogs} maxWidth="sm" fullWidth>
                <DialogTitle>Neuen Schauspieler hinzufügen</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField label="Vorname" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
                        <TextField label="Nachname" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button variant="contained" onClick={handleCreate} disabled={!firstName || !lastName}>
                                Erstellen
                            </Button>
                            <Button variant="outlined" onClick={closeDialogs}>
                                Abbrechen
                            </Button>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ActorPage
