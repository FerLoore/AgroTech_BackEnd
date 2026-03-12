import { Router } from "express";
import {
  getAlertas,
  getAlertaById,
  createAlerta,
  updateAlerta,
  deleteAlerta
} from "../handlers/agroAlertaSalud.handler";

const router = Router();

// GET    /api/agro-alerta-salud
router.get("/", getAlertas);

// GET    /api/agro-alerta-salud/:id
router.get("/:id", getAlertaById);

// POST   /api/agro-alerta-salud
router.post("/", createAlerta);

// PUT    /api/agro-alerta-salud/:id
router.put("/:id", updateAlerta);

// DELETE /api/agro-alerta-salud/:id
router.delete("/:id", deleteAlerta);

export default router;