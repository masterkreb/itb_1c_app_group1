// backend/src/routes/actor.ts

import { Router, Request, Response } from "express";
import {
    getAllActors,
    getActorById,
    createActor,
    updateActor,
    deleteActor,
    addActorToFilm,
    deleteActorFilm
} from "../services/actorService";    // Pfad und Name müssen passen

const router = Router();

// CRUD

router.get("/", async (_req, res) => {
    try {
        const actors = await getAllActors();
        res.json({ message: "Actors geladen", data: actors });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const actor = await getActorById(+req.params.id);
        if (!actor) return res.status(404).json({ message: "Actor nicht gefunden" });
        res.json({ message: "Actor geladen", data: actor });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const newId = await createActor(req.body);
        res.status(201).json({ message: "Actor erstellt", id: newId });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const count = await updateActor(+req.params.id, req.body);
        if (!count) return res.status(404).json({ message: "Actor nicht gefunden" });
        res.json({ message: "Actor aktualisiert", updatedCount: count });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const count = await deleteActor(+req.params.id);
        if (!count) return res.status(404).json({ message: "Actor nicht gefunden" });
        res.json({ message: "Actor gelöscht", deletedCount: count });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// n:n Mapping

router.post("/:actor_id/film/:film_id", async (req, res) => {
    try {
        await addActorToFilm(+req.params.actor_id, +req.params.film_id);
        res.status(201).json({ message: "Actor dem Film hinzugefügt" });
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

router.delete("/:actor_id/film/:film_id", async (req, res) => {
    try {
        const count = await deleteActorFilm(+req.params.actor_id, +req.params.film_id);
        if (!count) return res.status(404).json({ message: "Keine Verknüpfung gefunden" });
        res.json({ message: "Verknüpfung entfernt" });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
