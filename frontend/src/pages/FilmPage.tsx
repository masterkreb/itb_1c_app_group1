// noinspection JSUnusedLocalSymbols

import React, {useEffect, useState} from 'react';
import {getAllFilms, createFilm} from "../service/FilmService.ts";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Dialog, DialogTitle, DialogContent, TextField, Stack, Snackbar, Alert
} from "@mui/material";
import {Film} from "../types/types.ts";
import {NavLink} from "react-router";

const FilmPage = () => {
    const [films, setFilms] = React.useState<Film[] | undefined>();
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        rental_rate: 0,
        rental_duration: 0
    });
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        getFilms();
    }, [])

    async function getFilms() {
        try {
            const tempFilms = await getAllFilms();
            console.log("Got films from server: ", tempFilms);
            if (tempFilms) {
                setFilms(tempFilms);
            }
            console.log("Ending GetFilms")
        } catch (error) {
            console.error("Error fetching films:", error);
            setError("Fehler beim Laden der Filme");
        }
    }

    const handleCreateFilm = async () => {
        try {
            // Debug: Zeige die zu sendenden Daten
            console.log('FormData vor Versand:', formData);

            // Erweiterte Validierung
            const validationErrors = [];
            if (!formData.title.trim()) validationErrors.push('Titel ist erforderlich');
            if (formData.rental_rate < 0) validationErrors.push('Leihgebühr muss positiv sein');
            if (formData.rental_duration < 1) validationErrors.push('Leihdauer muss mindestens 1 Tag sein');

            if (validationErrors.length > 0) {
                setError(validationErrors.join(', '));
                return;
            }

            // Erstelle ein vollständiges Film-Objekt
            const filmToCreate: Partial<Film> = {
                title: formData.title,
                description: formData.description,
                rental_rate: formData.rental_rate,
                rental_duration: formData.rental_duration,
                release_year: new Date().getFullYear(),
                length: 0,
                replacement_cost: formData.rental_rate * 10,
                rating: 'G',
                special_features: '',
                language_id: 1  // Füge eine Standard-Sprach-ID hinzu
            };

        console.log('Vollständiges Film-Objekt:', filmToCreate);

        const result = await createFilm(filmToCreate);
        console.log('Server Antwort:', result);
        
        setOpenCreateDialog(false);
        setFormData({
            title: '',
            description: '',
            rental_rate: 0,
            rental_duration: 0
        });
        await getFilms();
    } catch (err) {
        console.error('Fehler beim Erstellen des Films:', err);
        setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten');
    }
};
    const handleDeleteFilm = async (filmId: number) => {
        try {
            if (window.confirm('Sind Sie sicher, dass Sie diesen Film löschen möchten?')) {
                await deleteFilm(filmId);
                setError('Film erfolgreich gelöscht');
                await getFilms(); // Liste aktualisieren
            }
        } catch (err) {
            console.error('Fehler beim Löschen des Films:', err);
            setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value
        });
    };


    return (
        <div>
            Film Page
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <h2>Film Page</h2>
                <Button
                    variant="contained"
                    onClick={() => setOpenCreateDialog(true)}
                    sx={{ ml: 'auto' }}
                >
                    Neuen Film erstellen
                </Button>
            </Stack>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
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
                        {films ? (
                                films.map((row) => (
                                    <TableRow
                                        key={row.film_id}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell component="th" scope="row">{row.film_id}</TableCell>
                                        <TableCell component="th" scope="row">{row.title}</TableCell>
                                        <TableCell>{row.rental_rate}</TableCell>
                                        <TableCell>{row.rental_duration}</TableCell>
                                        <TableCell align="right"><NavLink to={"/film/"+row.film_id}>Details</NavLink></TableCell>
                                    </TableRow>
                                ))
                            )
                            : <TableRow>
                                <TableCell>Keine Filme vorhanden</TableCell>
                            </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Neuen Film erstellen</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField
                            name="title"
                            label="Titel"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            name="description"
                            label="Beschreibung"
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            name="rental_rate"
                            label="Leihgebühr"
                            type="number"
                            value={formData.rental_rate}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            name="rental_duration"
                            label="Leihdauer (Tage)"
                            type="number"
                            value={formData.rental_duration}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                            <Button
                                onClick={() => setOpenCreateDialog(false)}
                                color="inherit"
                            >
                                Abbrechen
                            </Button>
                            <Button
                                onClick={handleCreateFilm}
                                variant="contained"
                            >
                                Film erstellen
                            </Button>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>

            {/* Error Snackbar */}
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
            >
                <Alert
                    severity="error"
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            </Snackbar>

        </div>
    );
};

export default FilmPage;