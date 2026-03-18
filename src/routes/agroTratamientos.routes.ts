import { Router } from "express";
import {
  getTratamientos,
  getTratamientoById,
  createTratamiento,
  updateTratamiento,
  deleteTratamiento
} from "../handlers/agroTratamientos.handler";

const router = Router();

// GET todos
router.get("/", getTratamientos);

// GET por ID
router.get("/:id", getTratamientoById);

// POST crear
router.post("/", createTratamiento);

// PUT actualizar
router.put("/:id", updateTratamiento);

// DELETE eliminar
router.delete("/:id", deleteTratamiento);

export default router;