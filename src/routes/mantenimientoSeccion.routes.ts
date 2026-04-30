import { Router } from "express";
import { getMantenimientos, createMantenimiento, updateMantenimiento, deleteMantenimiento } from "../handlers/mantenimientoSeccion.handler";

const router = Router();

router.get("/", getMantenimientos);
router.post("/", createMantenimiento);
router.put("/:id", updateMantenimiento);
router.delete("/:id", deleteMantenimiento);

export default router;
