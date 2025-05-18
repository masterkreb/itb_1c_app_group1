import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TextField, Button } from "@mui/material";
import { createFilm } from "../service/FilmService";

const FilmCreatePage = () => {
    // titel, beschreibung
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

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
            actors: validActors // nur vollständige actor werden geschickt(wenn es leer=nicht speichert)
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

                {/* Schauspieler input gruppen */}
                {actorsInputs.map((actor, index) => (
                    <div key={index} style={{ display: "flex", gap: "10px" }}>
                        <TextField
                            label="Vorname"
                            value={actor.first_name}
                            onChange={(e) => handleActorChange(index, "first_name", e.target.value)}
                        />
                        <TextField
                            label="Nachname"
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

                {/* Film speichern */}
                <Button type="submit" variant="contained" color="success">
                    Film speichern
                </Button>
            </form>
        </div>
    );
};

export default FilmCreatePage;
