import React, { useState } from "react";
import { useNavigate } from "react-router";
import {TextField, Button, FormControl, Select, InputLabel} from "@mui/material";
import { createFilm } from "../service/FilmService";
import MenuItem from "@mui/material/MenuItem";

const FilmCreatePage = () => {
    // titel, beschreibung, jahr.....
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [releaseYear, setReleaseYear] = useState("");
    const [rating, setRating] = useState("");
    const [length, setLength] = useState("");
    const [rentalRate, setRentalRate] = useState("");
    const [rentalDuration, setRentalDuration] = useState("");
    const [replacementCost, setReplacementCost] = useState("");
    const [languageId, setLanguageId] = useState("");



    // liste von schauspieler input-felder
    const [actorsInputs, setActorsInputs] = useState([
        { first_name: "", last_name: "" }
    ]);

    const navigate = useNavigate(); // für weiterleitung

    // neue input zeile hinzufügen
    const handleAddActorInput = () => {
        if (actorsInputs.length < 5) {
            setActorsInputs([...actorsInputs, { first_name: "", last_name: "" }]);
        }
    };

    // ändere vorname oder nachname
    const handleActorChange = (index: number, field: "first_name" | "last_name", value: string) => {
        const updated = [...actorsInputs];
        updated[index][field] = value;
        setActorsInputs(updated);
    };

    // film speichern
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validActors = actorsInputs.filter(a => a.first_name.trim() && a.last_name.trim());

        const newFilm = {
            title,
            description,
            release_year: releaseYear,
            length: length,
            rating: rating,
            actors: validActors,
            rental_rate: rentalRate,
            rental_duration: rentalDuration,
            replacement_cost: replacementCost,
            language_id: languageId,
        };

        const result = await createFilm(newFilm);
        if (result) {
            navigate("/film");
        } else {
            alert("Fehler beim Speichern.");
        }
    };

    return (
        <div>
            <h2>Neuer Film erstellen</h2>

            {/* Formular für neue Film */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "400px" }}>
                <TextField
                    label="Titel"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <TextField
                    label="Beschreibung"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    multiline
                    rows={3}
                />
                <TextField
                    label="Jahr"
                    type="number"
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(e.target.value)}
                    required
                />
                <TextField
                label="Länge (Minuten)"
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                required
                />
                <FormControl fullWidth>
                    <InputLabel id="rating-label">Rating</InputLabel>
                    <Select
                        labelId="rating-label"
                        value={rating}
                        label="Rating"
                        onChange={(e) => setRating(e.target.value)}
                    >
                        <MenuItem value=""><em>Kein Rating</em></MenuItem>
                        <MenuItem value="G">G</MenuItem>
                        <MenuItem value="PG">PG</MenuItem>
                        <MenuItem value="PG-13">PG-13</MenuItem>
                        <MenuItem value="R">R</MenuItem>
                        <MenuItem value="NC-17">NC-17</MenuItem>
                    </Select>
                </FormControl>


                {/* Schauspieler input gruppen */}
                {actorsInputs.map((actor, index) => (
                    <div key={index} style={{ display: "flex", gap: "10px" }}>
                        <TextField
                            label="Vorname "
                            value={actor.first_name}
                            onChange={(e) => handleActorChange(index, "first_name", e.target.value)}
                        />
                        <TextField
                            label="Nachname "
                            value={actor.last_name}
                            onChange={(e) => handleActorChange(index, "last_name", e.target.value)}
                        />
                    </div>
                ))}

                {/* + Knopf für neue Schauspieler */}
                <Button
                    variant="outlined"
                    onClick={handleAddActorInput}
                    disabled={actorsInputs.length >= 5}
                >
                    + Schauspieler
                </Button>


                <TextField
                    label="Rental Rate"
                    type="number"
                    value={rentalRate}
                    onChange={(e) => setRentalRate(e.target.value)}
                    placeholder="z.B. 4.99"
                />

                <TextField
                    label="Rental Duration (Tage)"
                    type="number"
                    value={rentalDuration}
                    onChange={(e) => setRentalDuration(e.target.value)}
                    placeholder="z.B. 7"
                />

                <TextField
                    label="Replacement Cost"
                    type="number"
                    value={replacementCost}
                    onChange={(e) => setReplacementCost(e.target.value)}
                    placeholder="z.B. 19.99"
                />

                <FormControl fullWidth>
                    <InputLabel id="language-label">Sprache</InputLabel>
                    <Select
                        labelId="language-label"
                        value={languageId}
                        label="Sprache"
                        onChange={(e) => setLanguageId(e.target.value)}
                    >
                        <MenuItem value=""><em>Keine Sprache</em></MenuItem>
                        <MenuItem value="1">Englisch</MenuItem>
                        <MenuItem value="2">Italienisch</MenuItem>
                        <MenuItem value="3">Japanisch</MenuItem>
                        <MenuItem value="4">Mandarin</MenuItem>
                        <MenuItem value="5">Französisch</MenuItem>
                        <MenuItem value="6">Deutsch</MenuItem>

                    </Select>
                </FormControl>
                {/* Film speichern */}
                <Button type="submit" variant="contained" color="success">
                    Film speichern
                </Button>

            </form>
        </div>
    );
};

export default FilmCreatePage;
