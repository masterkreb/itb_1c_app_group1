"use client"

import { useEffect, useState, useCallback } from "react"
import type { Actor } from "../types/types"
import { getAllActors, deleteActor } from "../service/ActorService"

/**
 * Komponente zur Anzeige der Liste von Schauspielern
 * @returns JSX.Element
 */
const ActorPage = () => {
    const [actors, setActors] = useState<Actor[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    /**
     * Lädt alle Schauspieler beim Mounten der Komponente
     */
    const fetchActors = useCallback(async () => {
        try {
            setLoading(true)
            const data = await getAllActors()
            setActors(data)
            setError(null)
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Unbekannter Fehler"
            setError(`Fehler beim Laden der Schauspieler: ${errorMessage}`)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchActors()
    }, [fetchActors])

    /**
     * Behandelt das Löschen eines Schauspielers
     * @param {string} id - ID des zu löschenden Schauspielers
     */
    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Sind Sie sicher, dass Sie diesen Schauspieler löschen möchten?")
        if (!confirmed) return

        try {
            await deleteActor(id)
            setActors((prevActors) => prevActors.filter((actor) => actor.actor_id !== id))
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Unbekannter Fehler"
            setError(`Fehler beim Löschen des Schauspielers: ${errorMessage}`)
        }
    }

    /**
     * Navigiert zu einer anderen Seite
     * @param {string} path - Pfad zur Zielseite
     */
    const navigate = (path: string) => {
        window.location.href = path
    }

    if (loading) {
        return <div className="loading">Schauspieler werden geladen...</div>
    }

    if (error) {
        return (
            <div className="error">
                <p>{error}</p>
                <button onClick={() => fetchActors()}>Erneut versuchen</button>
            </div>
        )
    }

    return (
        <div className="actor-page">
            <div className="page-header">
                <h2>Schauspielerliste</h2>
                <button onClick={() => navigate("/actor/new")} className="button button-primary">
                    Neuen Schauspieler hinzufügen
                </button>
            </div>

            {actors.length === 0 ? (
                <div className="empty-state">
                    <p>Keine Schauspieler verfügbar</p>
                    <button onClick={() => navigate("/actor/new")} className="button">
                        Ersten Schauspieler erstellen
                    </button>
                </div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Vorname</th>
                            <th>Nachname</th>
                            <th>Aktionen</th>
                        </tr>
                        </thead>
                        <tbody>
                        {actors.map((actor) => (
                            <tr key={actor.actor_id}>
                                <td>{actor.actor_id}</td>
                                <td>{actor.first_name}</td>
                                <td>{actor.last_name}</td>
                                <td className="actions">
                                    <button onClick={() => navigate(`/actor/${actor.actor_id}`)} className="button button-small">
                                        Ansehen
                                    </button>
                                    <button
                                        onClick={() => navigate(`/actor/edit/${actor.actor_id}`)}
                                        className="button button-small button-secondary"
                                    >
                                        Bearbeiten
                                    </button>
                                    <button onClick={() => handleDelete(actor.actor_id)} className="button button-small button-danger">
                                        Löschen
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default ActorPage
