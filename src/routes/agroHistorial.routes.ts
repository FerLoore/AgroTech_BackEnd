import { Router } from "express";
import {
    getHistoriales,
    getHistorialById,
    getHistorialByArbol
} from "../handlers/agroHistorial.handler";

const router = Router();

router.get("/", getHistoriales);
router.get("/arbol/:id", getHistorialByArbol);
router.get("/:id", getHistorialById);


export default router;