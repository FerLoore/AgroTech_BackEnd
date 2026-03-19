import { Router } from "express";
import {
    getAgroSecciones,
    getAgroSeccionById,
    createAgroSeccion,
    updateAgroSeccion,
    deleteAgroSeccion
} from "../handlers/agroSeccion.handler";

const router = Router();

// ─────────────────────────────────────────────────────────────
// Rutas base: /api/agro-seccion
// ─────────────────────────────────────────────────────────────
router.get("/", getAgroSecciones);
router.get("/:id", getAgroSeccionById);
router.post("/", createAgroSeccion);
router.put("/:id", updateAgroSeccion);
router.delete("/:id", deleteAgroSeccion);

export default router;