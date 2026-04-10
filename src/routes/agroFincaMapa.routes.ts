import { Router } from "express";
import { getMapaFincaCompleto } from "../handlers/agroFincaMapa.handler";

const router = Router();

// GET /api/agro-finca-mapa/:fincaId
router.get("/:fincaId", getMapaFincaCompleto);

export default router;