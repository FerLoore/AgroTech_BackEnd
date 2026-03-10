import { Router } from "express";
import {
    getHistoriales,
    getHistorialById,
    createHistorial,
    updateHistorial,
    deleteHistorial
} from "../handlers/agroHistorial.handler";

const router = Router();

router.get("/", getHistoriales);
router.get("/:id", getHistorialById);
router.post("/", createHistorial);
router.put("/:id", updateHistorial);
router.delete("/:id", deleteHistorial);

export default router;