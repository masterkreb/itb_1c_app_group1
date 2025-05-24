"use client"

import { useEffect, useState } from "react"
import type { Film, Actor } from "../types/types.ts"
import {
    getAllFilms,
    createFilm,
    updateFilm,
    deleteFilm,
    addActorToFilm,
    removeActorFromFilm,
    getFilmById,
} from "../service/FilmService.ts"
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

const FilmPage = () => {
    const [films, setFilms] = useState<Film[]>([])
    const [selectedFilm, setSelectedFilm] = useState<Film | null>(null)
    const [availableActors, setAvailableActors] = useState<Actor[]>([])
    const [showViewDialog, setShowViewDialog] = useState<boolean>(false)
    const [showEditDialog, setShowEditDialog] = useState<boolean>(false)
    const [showAddDialog, setShowAddDialog] = useState<boolean>(false)
    const [showActorSelectionDialog, setShowActorSelectionDialog] = useState<boolean>(false)
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [rentalRate, setRentalRate] = useState<string>("")
    const [rentalDuration, setRentalDuration] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        rental_rate: 0,
        rental_duration: 0
    });
    const [error, setError] = useState<string | null>(null);

    // Films laden
    useEffect(() => {
        loadFilms()
    }, [])

    const loadFilms = async () => {
        try {
            const filmData = await getAllFilms()
            if (filmData) {
                setFilms(filmData)
            }
        } catch (error) {
            console.error("Fehler beim Laden der Filme:", error)
        }
    }

    const loadAvailableActors = async () => {
        try {
            setIsLoading(true)
            const actorData = await getAllActors()
            if (actorData) {
                setAvailableActors(actorData)
            }
        } catch (error) {
            console.error("Fehler beim Laden der Schauspieler:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleView = async (film: Film) => {
        try {
            // Cargar los detalles completos del film incluyendo actors
            console.log("Cargando detalles del film:", film.film_id)
            if (!film.film_id) {
                throw new Error("Film ID ist nicht definiert")
            }
            const fullFilmData = await getFilmById(film.film_id)
            console.log("Datos completos del film:", fullFilmData)
            setSelectedFilm(fullFilmData)
            setShowViewDialog(true)
        } catch (error) {
            console.error("Error al cargar detalles del film:", error)
            // Fallback: usar los datos básicos del film
            setSelectedFilm(film)
            setShowViewDialog(true)
        }
    }

    const handleEdit = (film: Film) => {
        setSelectedFilm(film)
        setTitle(film.title)
        setDescription(film.description)
        setRentalRate(film.rental_rate?.toString() || "")
        setRentalDuration(film.rental_duration?.toString() || "")
        setShowEditDialog(true)
    }

    // Ändern Sie die handleAdd Funktion:
    const handleAdd = () => {
        setFormData({
            title: '',
            description: '',
            rental_rate: 0,
            rental_duration: 0
        });
        setShowAddDialog(true);
    }

    const handleAddActor = (film: Film) => {
        setSelectedFilm(film)
        setShowActorSelectionDialog(true)
        loadAvailableActors()
    }

    const handleSave = async () => {
        if (!selectedFilm) return

        try {
            if (!selectedFilm.film_id) return;
            await updateFilm(selectedFilm.film_id, {
                title,
                description,
                rental_rate: Number.parseFloat(rentalRate),
                rental_duration: Number.parseInt(rentalDuration),
            })
            setShowEditDialog(false)
            loadFilms()
        } catch (error) {
            console.error("Fehler beim Speichern:", error)
        }
    }

    const handleCreate = async () => {
        try {
            // Minimales Film-Objekt mit nur den notwendigsten Feldern
            const filmToCreate = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                rental_rate: Number(formData.rental_rate),
                rental_duration: Number(formData.rental_duration),
                language_id: 1,  // Pflichtfeld für die Sakila-DB
                release_year: new Date().getFullYear()
            };

            console.log('Sende Film-Daten:', filmToCreate);
            const result = await createFilm(filmToCreate);
            
            if (result) {
                setShowAddDialog(false);
                setFormData({
                    title: '',
                    description: '',
                    rental_rate: 0,
                    rental_duration: 0
                });
                await loadFilms();
            }
        } catch (err) {
            console.error('Fehler beim Erstellen des Films:', err);
            setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten');
        }
    };

    const handleDelete = async (film: Film) => {
        if (confirm(`Film "${film.title}" wirklich löschen?`)) {
            try {
                if (!film.film_id) return;
                const success = await deleteFilm(film.film_id)
                if (success) {
                    await loadFilms()
                }
            } catch (error) {
                console.error("Fehler beim Löschen:", error)
            }
        }
    }

    const handleAddActorToFilm = async (actor: Actor) => {
        if (!selectedFilm) return

        if (!actor.actor_id) {
            console.error("Actor ID is undefined:", actor)
            alert("Error: Actor ID no válido")
            return
        }

        try {
            if (!selectedFilm.film_id) return;
            const success = await addActorToFilm(selectedFilm.film_id, actor.actor_id)
            if (success) {
                loadFilms()
                setShowActorSelectionDialog(false)
                // Recargar los detalles del film
                const updatedFilm = await getFilmById(selectedFilm.film_id)
                setSelectedFilm(updatedFilm)
            }
        } catch (error) {
            console.error("Fehler beim Hinzufügen des Schauspielers:", error)
            alert("Error al agregar el actor")
        }
    }

    const handleRemoveActorFromFilm = async (actor: Actor) => {
        if (!selectedFilm) return

        if (!actor.actor_id) {
            console.error("Actor ID is undefined:", actor)
            alert("Error: Actor ID no válido")
            return
        }

        try {
            if (!selectedFilm.film_id) return;
            const success = await removeActorFromFilm(selectedFilm.film_id, actor.actor_id)
            if (success) {
                loadFilms()
                // Recargar los detalles del film
                const updatedFilm = await getFilmById(selectedFilm.film_id)
                setSelectedFilm(updatedFilm)
            }
        } catch (error) {
            console.error("Fehler beim Entfernen des Schauspielers:", error)
            alert("Error al eliminar el actor")
        }
    }

    const closeDialogs = () => {
        setShowViewDialog(false)
        setShowEditDialog(false)
        setShowAddDialog(false)
        setShowActorSelectionDialog(false)
        setSelectedFilm(null)
        setSearchTerm("") // Reset search when closing dialogs
    }

    const isActorAlreadyAssigned = (actor: Actor): boolean => {
        if (!selectedFilm?.actors) return false
        return selectedFilm.actors.some((a) => a.actor_id === actor.actor_id)
    }

    const filteredActors = availableActors
        .filter((actor) => !isActorAlreadyAssigned(actor))
        .filter(
            (actor) =>
                actor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                actor.last_name.toLowerCase().includes(searchTerm.toLowerCase()),
        )

    return (
        <div>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <h2>Filmliste</h2>
                <Button variant="contained" onClick={handleAdd}>
                    Neuen Film hinzufügen
                </Button>
            </Stack>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Titel</TableCell>
                            <TableCell>Beschreibung</TableCell>
                            <TableCell>Preis</TableCell>
                            <TableCell>Dauer</TableCell>
                            <TableCell>Aktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {films.map((film) => (
                            <TableRow key={`film-${film.film_id}`}>
                                <TableCell>{film.film_id}</TableCell>
                                <TableCell>{film.title}</TableCell>
                                <TableCell sx={{ maxWidth: 200 }}>
                                    {film.description.length > 50 ? `${film.description.substring(0, 50)}...` : film.description}
                                </TableCell>
                                <TableCell>{film.rental_rate}</TableCell>
                                <TableCell>{film.rental_duration}</TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        <Button size="small" onClick={() => handleView(film)}>
                                            Ansehen
                                        </Button>
                                        <Button size="small" onClick={() => handleEdit(film)}>
                                            Bearbeiten
                                        </Button>
                                        <Button size="small" color="error" onClick={() => handleDelete(film)}>
                                            Löschen
                                        </Button>
                                        <Button size="small" color="primary" onClick={() => handleAddActor(film)}>
                                            Schauspieler hinzufügen
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
                <DialogTitle>Film Details</DialogTitle>
                <DialogContent>
                    {selectedFilm && (
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{selectedFilm.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ID: {selectedFilm.film_id}
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
                                    {selectedFilm.description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Preis: {selectedFilm.rental_rate} | Dauer: {selectedFilm.rental_duration} Tage
                                </Typography>

                                <h4>Schauspieler:</h4>
                                <Typography variant="caption" color="text.secondary">
                                    Debug: Actors array length: {selectedFilm.actors?.length || 0}
                                </Typography>

                                {selectedFilm.actors && selectedFilm.actors.length > 0 ? (
                                    <List>
                                        {selectedFilm.actors
                                            .filter((actor) => actor.actor_id)
                                            .map((actor) => (
                                                <ListItem key={`actor-${actor.actor_id}`}>
                                                    <Card sx={{ width: "100%" }}>
                                                        <CardContent>
                                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                                <div>
                                                                    <Typography variant="h6">
                                                                        {actor.first_name} {actor.last_name}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        ID: {actor.actor_id}
                                                                    </Typography>
                                                                </div>
                                                                <Button size="small" color="error" onClick={() => handleRemoveActorFromFilm(actor)}>
                                                                    Entfernen
                                                                </Button>
                                                            </Stack>
                                                        </CardContent>
                                                    </Card>
                                                </ListItem>
                                            ))}
                                    </List>
                                ) : (
                                    <Typography>Keine Schauspieler verfügbar</Typography>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog für Bearbeiten */}
            <Dialog open={showEditDialog} onClose={closeDialogs} maxWidth="sm" fullWidth>
                <DialogTitle>Film bearbeiten</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField label="Titel" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
                        <TextField
                            label="Beschreibung"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                        />
                        <TextField
                            label="Preis"
                            value={rentalRate}
                            onChange={(e) => setRentalRate(e.target.value)}
                            fullWidth
                            type="number"
                            step="0.01"
                        />
                        <TextField
                            label="Dauer (Tage)"
                            value={rentalDuration}
                            onChange={(e) => setRentalDuration(e.target.value)}
                            fullWidth
                            type="number"
                        />
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
                <DialogTitle>Neuen Film hinzufügen</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField 
                            label="Titel" 
                            value={formData.title} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})} 
                            fullWidth 
                            required 
                        />
                        <TextField
                            label="Beschreibung"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            fullWidth
                            multiline
                            rows={3}
                            required
                        />
                        <TextField
                            label="Preis"
                            value={formData.rental_rate}
                            onChange={(e) => setFormData({...formData, rental_rate: Number(e.target.value)})}
                            fullWidth
                            type="number"
                            step="0.01"
                            required
                        />
                        <TextField
                            label="Dauer (Tage)"
                            value={formData.rental_duration}
                            onChange={(e) => setFormData({...formData, rental_duration: Number(e.target.value)})}
                            fullWidth
                            type="number"
                            required
                        />
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button 
                                variant="contained" 
                                onClick={handleCreate} 
                                disabled={!formData.title || formData.rental_rate <= 0 || formData.rental_duration <= 0}
                            >
                                Erstellen
                            </Button>
                            <Button variant="outlined" onClick={closeDialogs}>
                                Abbrechen
                            </Button>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>

            {/* Dialog für Schauspieler-Auswahl */}
            <Dialog open={showActorSelectionDialog} onClose={closeDialogs} maxWidth="md" fullWidth>
                <DialogTitle>Schauspieler zu Film hinzufügen</DialogTitle>
                <DialogContent>
                    {isLoading ? (
                        <Typography>Lade Schauspieler...</Typography>
                    ) : (
                        <>
                            {/* Search Bar */}
                            <TextField
                                label="Schauspieler suchen..."
                                variant="outlined"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{ mb: 2, mt: 1 }}
                                placeholder="Vor- oder Nachname eingeben..."
                            />

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {filteredActors.length} Schauspieler gefunden
                            </Typography>

                            <List>
                                {filteredActors.map((actor) => (
                                    <ListItem key={`available-actor-${actor.actor_id}`}>
                                        <Card sx={{ width: "100%" }}>
                                            <CardContent>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <div>
                                                        <Typography variant="h6">
                                                            {actor.first_name} {actor.last_name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            ID: {actor.actor_id}
                                                        </Typography>
                                                    </div>
                                                    <Button variant="contained" onClick={() => handleAddActorToFilm(actor)}>
                                                        Hinzufügen
                                                    </Button>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </ListItem>
                                ))}
                            </List>

                            {filteredActors.length === 0 && searchTerm && (
                                <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
                                    Keine Schauspieler gefunden für "{searchTerm}"
                                </Typography>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default FilmPage