import { Router } from "express";
import {
    getAgroUsuarios,
    getAgroUsuarioById,
    createAgroUsuario,
    updateAgroUsuario,
    deleteAgroUsuario
} from "../handlers/agroUsuario.handler";

const router = Router();

// ─────────────────────────────────────────────────────────────
// Rutas base: /api/agro-usuario
// ─────────────────────────────────────────────────────────────
router.get("/", getAgroUsuarios);
router.get("/:id", getAgroUsuarioById);
router.post("/", createAgroUsuario);
router.put("/:id", updateAgroUsuario);
router.delete("/:id", deleteAgroUsuario);

export default router;