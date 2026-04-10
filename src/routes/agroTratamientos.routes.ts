import { Router } from "express";
import {
  getTratamientos,
  getTratamientoById,
  createTratamiento,
  updateTratamiento,
  deleteTratamiento,
  finalizarTratamiento // <--- Agregamos esta importación
} from "../handlers/agroTratamientos.handler";

const router = Router();

// Rutas CRUD estándar
router.get("/", getTratamientos);
router.get("/:id", getTratamientoById);
router.post("/", createTratamiento);
router.put("/:id", updateTratamiento);
router.delete("/:id", deleteTratamiento);

// Ruta de lógica de negocio (Finalizar y crear historial)
// Usamos POST porque estamos ejecutando una acción que afecta múltiples tablas
router.post("/finalizar/:id", finalizarTratamiento);

export default router;