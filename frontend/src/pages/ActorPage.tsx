"use client"

import { useEffect, useState } from "react"
import type { Actor, Film } from "../types/types.ts"
import {
    getAllActors,
    createActor,
    updateActor,
    deleteActor,
    addFilmToActor,
    removeFilmFromActor,
    getActorById,
} from "../service/ActorService.ts"
import { getAllFilms } from "../service/FilmService.ts"
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
    const [availableFilms, setAvailableFilms] = useState<Film[]>([])
    const [showViewDialog, setShowViewDialog] = useState<boolean>(false)
    const [showEditDialog, setShowEditDialog] = useState<boolean>(false)
    const [showAddDialog, setShowAddDialog] = useState<boolean>(false)
    const [showFilmSelectionDialog, setShowFilmSelectionDialog] = useState<boolean>(false)
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [searchTerm, setSearchTerm] = useState<string>("")

    // Actors laden
    useEffect(() => {
        loadActors()
    }, [])

    const loadActors = async () => {
        try {
            const actorData = await getAllActors()
            if (actorData) {
                setActors(actorData)
            }
        } catch (error) {
            console.error("Fehler beim Laden der Schauspieler:", error)
        }
    }

    const loadAvailableFilms = async () => {
        try {
            setIsLoading(true)
            const filmData = await getAllFilms()
            if (filmData) {
                setAvailableFilms(filmData)
            }
        } catch (error) {
            console.error("Fehler beim Laden der Filme:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleView = async (actor: Actor) => {
        try {
            // Cargar los detalles completos del actor incluyendo films
            console.log("Cargando detalles del actor:", actor.actor_id)
            const fullActorData = await getActorById(actor.actor_id)
            console.log("Datos completos del actor:", fullActorData)
            setSelectedActor(fullActorData)
            setShowViewDialog(true)
        } catch (error) {
            console.error("Error al cargar detalles del actor:", error)
            // Fallback: usar los datos básicos del actor
            setSelectedActor(actor)
            setShowViewDialog(true)
        }
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

    const handleAddFilm = (actor: Actor) => {
        setSelectedActor(actor)
        setShowFilmSelectionDialog(true)
        loadAvailableFilms()
    }

    const handleSave = async () => {
        if (!selectedActor) return

        try {
            await updateActor(selectedActor.actor_id, {
                first_name: firstName,
                last_name: lastName,
            })
            setShowEditDialog(false)
            loadActors()
        } catch (error) {
            console.error("Fehler beim Speichern:", error)
        }
    }

    const handleCreate = async () => {
        try {
            await createActor({
                first_name: firstName,
                last_name: lastName,
                last_update: new Date().toISOString(),
            })
            setShowAddDialog(false)
            loadActors()
        } catch (error) {
            console.error("Fehler beim Erstellen:", error)
        }
    }

    const handleDelete = async (actor: Actor) => {
        if (confirm(`Schauspieler ${actor.first_name} ${actor.last_name} wirklich löschen?`)) {
            try {
                const success = await deleteActor(actor.actor_id)
                if (success) {
                    loadActors()
                }
            } catch (error) {
                console.error("Fehler beim Löschen:", error)
            }
        }
    }

    const handleAddFilmToActor = async (film: Film) => {
        if (!selectedActor) return

        if (!film.film_id) {
            console.error("Film ID is undefined:", film)
            alert("Error: Film ID no válido")
            return
        }

        try {
            const success = await addFilmToActor(film.film_id, selectedActor.actor_id)
            if (success) {
                loadActors()
                setShowFilmSelectionDialog(false)
                // Recargar los detalles del actor
                const updatedActor = await getActorById(selectedActor.actor_id)
                setSelectedActor(updatedActor)
            }
        } catch (error) {
            console.error("Fehler beim Hinzufügen des Films:", error)
            alert("Error al agregar el film")
        }
    }

    const handleRemoveFilmFromActor = async (film: Film) => {
        if (!selectedActor) return

        if (!film.film_id) {
            console.error("Film ID is undefined:", film)
            alert("Error: Film ID no válido")
            return
        }

        try {
            const success = await removeFilmFromActor(film.film_id, selectedActor.actor_id)
            if (success) {
                loadActors()
                // Recargar los detalles del actor
                const updatedActor = await getActorById(selectedActor.actor_id)
                setSelectedActor(updatedActor)
            }
        } catch (error) {
            console.error("Fehler beim Entfernen des Films:", error)
            alert("Error al eliminar el film")
        }
    }

    const closeDialogs = () => {
        setShowViewDialog(false)
        setShowEditDialog(false)
        setShowAddDialog(false)
        setShowFilmSelectionDialog(false)
        setSelectedActor(null)
        setSearchTerm("") // Reset search when closing dialogs
    }

    const isFilmAlreadyAssigned = (film: Film): boolean => {
        if (!selectedActor?.films) return false
        return selectedActor.films.some((f) => f.film_id === film.film_id)
    }

    const filteredFilms = availableFilms
        .filter((film) => !isFilmAlreadyAssigned(film))
        .filter(
            (film) =>
                film.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                film.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )

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
                                        <Button size="small" color="primary" onClick={() => handleAddFilm(actor)}>
                                            Film hinzufügen
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
                                {/* Debug info */}
                                <Typography variant="caption" color="text.secondary">
                                    Debug: Films array length: {selectedActor.films?.length || 0}
                                </Typography>

                                {selectedActor.films && selectedActor.films.length > 0 ? (
                                    <List>
                                        {selectedActor.films
                                            .filter((film) => film.film_id)
                                            .map((film) => (
                                                <ListItem key={`film-${film.film_id}`}>
                                                    <Card sx={{ width: "100%" }}>
                                                        <CardContent>
                                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                                <div>
                                                                    <Typography variant="h6">{film.title}</Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {film.description}
                                                                    </Typography>
                                                                    {film.rental_rate && (
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            Preis: {film.rental_rate} | Dauer: {film.rental_duration}
                                                                        </Typography>
                                                                    )}
                                                                </div>
                                                                <Button size="small" color="error" onClick={() => handleRemoveFilmFromActor(film)}>
                                                                    Entfernen
                                                                </Button>
                                                            </Stack>
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

            {/* Dialog für Film-Auswahl */}
            <Dialog open={showFilmSelectionDialog} onClose={closeDialogs} maxWidth="md" fullWidth>
                <DialogTitle>Film zu Schauspieler hinzufügen</DialogTitle>
                <DialogContent>
                    {isLoading ? (
                        <Typography>Lade Filme...</Typography>
                    ) : (
                        <>
                            {/* Search Bar */}
                            <TextField
                                label="Film suchen..."
                                variant="outlined"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{ mb: 2, mt: 1 }}
                                placeholder="Titel oder Beschreibung eingeben..."
                            />

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {filteredFilms.length} Film(e) gefunden
                            </Typography>

                            <List>
                                {filteredFilms.map((film) => (
                                    <ListItem key={`available-film-${film.film_id}`}>
                                        <Card sx={{ width: "100%" }}>
                                            <CardContent>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <div>
                                                        <Typography variant="h6">{film.title}</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {film.description}
                                                        </Typography>
                                                        {film.rental_rate && (
                                                            <Typography variant="body2" color="text.secondary">
                                                                Preis: {film.rental_rate} | Dauer: {film.rental_duration}
                                                            </Typography>
                                                        )}
                                                    </div>
                                                    <Button variant="contained" onClick={() => handleAddFilmToActor(film)}>
                                                        Hinzufügen
                                                    </Button>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </ListItem>
                                ))}
                            </List>

                            {filteredFilms.length === 0 && searchTerm && (
                                <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
                                    Keine Filme gefunden für "{searchTerm}"
                                </Typography>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ActorPage
//