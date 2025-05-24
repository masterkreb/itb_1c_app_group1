// frontend/src/pages/ActorFormular.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    TextField,
    Button,
    Stack,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import { getActorById, createActor, updateActor, deleteActor } from "../service/ActorService";
import { getAllFilms } from "../service/FilmService";
import { Film } from "../types/types";

const ActorFormular: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [input, setInput] = useState({ first_name: "", last_name: "" });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [allFilms, setAllFilms] = useState<Film[]>([]);
    const [selectedFilms, setSelectedFilms] = useState<number[]>([]);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);

    useEffect(() => {
        getAllFilms().then(films => setAllFilms(films ?? []));

        if (id) {
            getActorById(id).then(actor => {
                if (actor) {
                    setInput({
                        first_name: actor.first_name,
                        last_name: actor.last_name
                    });
                    if (actor.films) {
                        setSelectedFilms(actor.films.map(f => f.film_id!));
                    }
                }
            });
        }
    }, [id]);

    const validate = (): boolean => {
        const errs: { [key: string]: string } = {};
        if (!input.first_name || input.first_name.length < 1) {
            errs.first_name = "Vorname ist erforderlich.";
        }
        if (!input.last_name || input.last_name.length < 1) {
            errs.last_name = "Nachname ist erforderlich.";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!validate()) return;

        let actorId: number | undefined;

        if (id) {
            const updated = await updateActor(id, input);
            if (!updated) return alert("Fehler beim Aktualisieren.");
            actorId = +id;
        } else {
            const newId = await createActor(input);
            if (!newId) return alert("Fehler beim Erstellen.");
            actorId = newId;
        }

        if (actorId !== undefined) {
            await Promise.all(
                allFilms.map(f =>
                    fetch(`http://localhost:3000/actor/${actorId}/film/${f.film_id}`, {
                        method: "DELETE"
                    })
                )
            );
            await Promise.all(
                selectedFilms.map(fid =>
                    fetch(`http://localhost:3000/actor/${actorId}/film/${fid}`, {
                        method: "POST"
                    })
                )
            );
        }

        navigate("/actor");
    };

    const handleDelete = async () => {
        setDeleteConfirmOpen(false);
        if (id) {
            const success = await deleteActor(id);
            if (success) {
                setDeleteSuccessOpen(true);
                setTimeout(() => navigate("/actor"), 2000);
            }
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                {id ? "Schauspieler bearbeiten" : "Neuen Schauspieler anlegen"}
            </Typography>
            <Stack spacing={2}>
                <TextField
                    label="Vorname"
                    name="first_name"
                    value={input.first_name}
                    onChange={handleChange}
                    error={Boolean(errors.first_name)}
                    helperText={errors.first_name}
                    fullWidth
                />
                <TextField
                    label="Nachname"
                    name="last_name"
                    value={input.last_name}
                    onChange={handleChange}
                    error={Boolean(errors.last_name)}
                    helperText={errors.last_name}
                    fullWidth
                />
                <FormControl fullWidth>
                    <InputLabel id="film-multi-label">Filme</InputLabel>
                    <Select
                        labelId="film-multi-label"
                        multiple
                        value={selectedFilms}
                        onChange={(e: SelectChangeEvent<number[]>) =>
                            setSelectedFilms(e.target.value as number[])
                        }
                        renderValue={(selected) =>
                            allFilms
                                .filter(f => selected.includes(f.film_id!))
                                .map(f => f.title)
                                .join(", ")
                        }
                    >
                        {allFilms.map((film) => (
                            <MenuItem key={film.film_id} value={film.film_id!}>
                                {film.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Stack direction="row" spacing={2}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Speichern
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => navigate("/actor")}>
                        Zurück
                    </Button>
                    {id && (
                        <Button variant="contained" color="error" onClick={() => setDeleteConfirmOpen(true)}>
                            Löschen
                        </Button>
                    )}
                </Stack>
            </Stack>

            {/* Lösch-Dialog */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Löschen bestätigen</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Möchten Sie diesen Schauspieler wirklich löschen?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)} color="secondary">
                        Abbrechen
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Löschen
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Erfolg nach Löschen */}
            <Dialog open={deleteSuccessOpen} onClose={() => setDeleteSuccessOpen(false)}>
                <DialogTitle>Schauspieler gelöscht</DialogTitle>
                <DialogContent>
                    <DialogContentText>Der Schauspieler wurde erfolgreich gelöscht.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => navigate("/actor")} color="primary">
                        Zurück zur Übersicht
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ActorFormular;
