import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getFilmById } from "../../service/FilmService.ts"; // Film holen
import { updateFilm } from "../../service/FilmService.ts"; // Film aktualisieren
import { useNavigate } from "react-router";



const FilmEditPage = () => {
    const navigate = useNavigate();

    const { id } = useParams(); // ID aus URL
    const [film, setFilm] = useState<any>(null); // Film wird gespeichert
    const handleSave = async () => {
        const success = await updateFilm(film.film_id.toString(), film);

        if (success) {
            alert("Film gespeichert");
            navigate("/film"); // // zurück zur Übersicht
        } else {
            alert("Speichern fehlgeschlagen");
        }
    };


    useEffect(() => {
        if (id) {
            getFilmById(id).then((data) => {
                if (data) {
                    setFilm(data); // Film-Daten speichern
                }
            });
        }
    }, [id]);

    if (!film) {
        return <div>Film wird geladen...</div>; // Wenn Film noch nicht da ist
    }

    return (
        <div>
            <h2>Film bearbeiten</h2>
            <label>Titel:</label>
            <input
                type="text"
                value={film.title}
                onChange={(e) => setFilm({ ...film, title: e.target.value })}
            />
            <label>Beschreibung:</label>
            <input
                type="text"
                value={film.description}
                onChange={(e) => setFilm({ ...film, description: e.target.value })}
            />
            <label>Jahr:</label>
            <input
                type="number"
                value={film.release_year}
                onChange={(e) => setFilm({ ...film, release_year: Number(e.target.value) })}

            />
            <button type="button" onClick={handleSave}>
                Speichern
            </button>



        </div>
    );
};

export default FilmEditPage;
