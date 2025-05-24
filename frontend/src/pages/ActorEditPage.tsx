"use client"

import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import type { Actor } from "../types/types.ts"
import { getActorById } from "../service/ActorService.ts"
import { Card, CardContent, Typography, Stack, Button, TextField } from "@mui/material"

const ActorEditPage = () => {
    const params = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [actor, setActor] = React.useState<Actor | null>(null)
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")

    // Actor laden
    useEffect(() => {
        if (params.id) {
            const actorId = Number(params.id)
            if (!isNaN(actorId)) {
                getActorById(actorId)
                    .then((actorData) => {
                        setActor(actorData)
                        setFirstName(actorData.first_name)
                        setLastName(actorData.last_name)
                    })
                    .catch((error) => console.error("Fehler beim Laden des Schauspielers:", error))
            }
        }
    }, [params.id])

    const handleSave = () => {
        // Hier würdest du die Update-Logik implementieren
        console.log("Speichern:", { firstName, lastName })
        navigate(`/actor/${params.id}`)
    }

    const handleCancel = () => {
        navigate(`/actor/${params.id}`)
    }

    return (
        <div>
            <h2>Schauspieler bearbeiten</h2>
            {actor ? (
                <Card sx={{ maxWidth: 600, margin: "0 auto", mt: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Schauspieler ID: {actor.actor_id}
                        </Typography>

                        <Stack spacing={3}>
                            <TextField label="Vorname" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
                            <TextField label="Nachname" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />

                            <Stack direction="row" spacing={2} justifyContent="center">
                                <Button variant="contained" onClick={handleSave}>
                                    Speichern
                                </Button>
                                <Button variant="outlined" onClick={handleCancel}>
                                    Abbrechen
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            ) : (
                <p>Keine Schauspielerdaten verfügbar</p>
            )}
        </div>
    )
}

export default ActorEditPage
