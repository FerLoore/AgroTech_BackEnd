import { Router } from "express";
import {
  getAnalisis,
  getAnalisisById,
  createAnalisis,
  updateAnalisis,
  deleteAnalisis
} from "../handlers/agroAnalisisLaboratorio.handler";

const router = Router();

// GET todos
router.get("/", getAnalisis);

// GET por ID
router.get("/:id", getAnalisisById);

// POST crear
router.post("/", createAnalisis);

// PUT actualizar
router.put("/:id", updateAnalisis);

// DELETE eliminar
router.delete("/:id", deleteAnalisis);

export default router;