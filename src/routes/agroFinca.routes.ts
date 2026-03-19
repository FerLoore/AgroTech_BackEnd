import { Router } from "express";
import {
    getAgroFincas,
    getAgroFincaById,
    createAgroFinca,
    updateAgroFinca,
    deleteAgroFinca
} from "../handlers/agroFinca.handler";

const router = Router();

// Rutas base: /api/agro-finca
router.get("/", getAgroFincas);
router.get("/:id", getAgroFincaById);
router.post("/", createAgroFinca);
router.put("/:id", updateAgroFinca);
router.delete("/:id", deleteAgroFinca);

export default router;