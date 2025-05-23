"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, Link } from "react-router-dom"
import type { Actor, Film } from "../types/types"
import { getActorById, addFilmToActor, removeFilmFromActor } from "../service/ActorService"
import { getAllFilms } from "../service/FilmService"

/**
 * Komponente zur Anzeige der Schauspielerdetails
 * @returns JSX.Element
 */
const ActorDetailsPage = () => {
    const { id } = useParams<{ id: string }>()
    const [actor, setActor] = useState<Actor | null>(null)
    const [films, setFilms] = useState<Film[]>([])
    const [selectedFilm, setSelectedFilm] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState<boolean>(false)

    /**
     * Lädt die Schauspielerdetails und verfügbare Filme
     */
    const fetchData = useCallback(async () => {
        if (!id) {
            setError("Keine Schauspieler-ID angegeben")
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const [actorData, filmsData] = await Promise.all([getActorById(id), getAllFilms()])

            setActor(actorData)
            setFilms(filmsData)
            setError(null)
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Unbekannter Fehler"
            setError(`Fehler beim Laden der Daten: ${errorMessage}`)
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    /**
     * Behandelt das Hinzufügen eines Films zum Schauspieler
     */
    const handleAddFilm = async () => {
        if (!selectedFilm || !actor) return

        try {
            setActionLoading(true)
            await addFilmToActor(actor.actor_id, selectedFilm)

            // Schauspieler neu laden
            const updatedActor = await getActorById(actor.actor_id)
            setActor(updatedActor)
            setSelectedFilm("")
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Unbekannter Fehler"
            setError(`Fehler beim Hinzufügen des Films: ${errorMessage}`)
        } finally {
            setActionLoading(false)
        }
    }

    /**
     * Behandelt das Entfernen eines Films vom Schauspieler
     * @param {string} filmId - ID des zu entfernenden Films
     */
    const handleRemoveFilm = async (filmId: string) => {
        if (!actor) return

        const confirmed = window.confirm("Sind Sie sicher, dass Sie diesen Film vom Schauspieler entfernen möchten?")
        if (!confirmed) return

        try {
            setActionLoading(true)
            await removeFilmFromActor(actor.actor_id, filmId)

            // Schauspieler neu laden
            const updatedActor = await getActorById(actor.actor_id)
            setActor(updatedActor)
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Unbekannter Fehler"
            setError(`Fehler beim Entfernen des Films: ${errorMessage}`)
        } finally {
            setActionLoading(false)
        }
    }

    if (loading) {
        return <div className="loading">Details werden geladen...</div>
    }

    if (error) {
        return (
            <div className="error">
                <p>{error}</p>
                <Link to="/actor" className="button">
                    Zurück zur Schauspielerliste
                </Link>
            </div>
        )
    }

    if (!actor) {
        return (
            <div className="not-found">
                <h2>Schauspieler nicht gefunden</h2>
                <Link to="/actor" className="button">
                    Zurück zur Schauspielerliste
                </Link>
            </div>
        )
    }

    // Verfügbare Filme (nicht bereits mit dem Schauspieler verknüpft)
    const availableFilms = films.filter((film) => !actor.films?.some((actorFilm) => actorFilm.film_id === film.film_id))

    return (
        <div className="actor-details-page">
            <div className="page-header">
                <h2>Schauspieler Details</h2>
                <div className="header-actions">
                    <Link to={`/actor/edit/${actor.actor_id}`} className="button button-secondary">
                        Schauspieler bearbeiten
                    </Link>
                    <Link to="/actor" className="button">
                        Zurück zur Liste
                    </Link>
                </div>
            </div>

            <div className="actor-info">
                <div className="info-card">
                    <h3>Schauspieler Informationen</h3>
                    <p>
                        <strong>ID:</strong> {actor.actor_id}
                    </p>
                    <p>
                        <strong>Vorname:</strong> {actor.first_name}
                    </p>
                    <p>
                        <strong>Nachname:</strong> {actor.last_name}
                    </p>
                </div>
            </div>

            <div className="films-section">
                <h3>Filme dieses Schauspielers</h3>
                {actor.films && actor.films.length > 0 ? (
                    <div className="films-list">
                        {actor.films.map((film) => (
                            <div key={film.film_id} className="film-item">
                                <span className="film-title">{film.title}</span>
                                <button
                                    onClick={() => handleRemoveFilm(film.film_id)}
                                    disabled={actionLoading}
                                    className="button button-small button-danger"
                                >
                                    Entfernen
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="empty-message">Keine Filme für diesen Schauspieler</p>
                )}
            </div>

            <div className="add-film-section">
                <h3>Film hinzufügen</h3>
                <div className="add-film-form">
                    <select
                        value={selectedFilm}
                        onChange={(e) => setSelectedFilm(e.target.value)}
                        disabled={actionLoading}
                        className="film-select"
                    >
                        <option value="">Film auswählen</option>
                        {availableFilms.map((film) => (
                            <option key={film.film_id} value={film.film_id}>
                                {film.title}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleAddFilm} disabled={!selectedFilm || actionLoading} className="button button-primary">
                        {actionLoading ? "Wird hinzugefügt..." : "Hinzufügen"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ActorDetailsPage
