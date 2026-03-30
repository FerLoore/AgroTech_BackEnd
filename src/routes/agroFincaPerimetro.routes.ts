import { Router } from "express";
import { guardarPerimetro, getPerimetro } from "../handlers/agroFincaPerimetro.handler";

const router = Router();

// GET /api/agro-finca-perimetro/:fincaId
router.get("/:fincaId", getPerimetro);

// POST /api/agro-finca-perimetro/:fincaId
router.post("/:fincaId", guardarPerimetro);

export default router;