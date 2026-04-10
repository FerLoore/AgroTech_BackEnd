import { Router } from "express";
import { 
    getFumigaciones, 
    createFumigacion, 
    marcarRealizada 
} from "../handlers/agroFumigacion.handler";

const router = Router();

// Obtener todas las fumigaciones programadas
router.get("/", getFumigaciones);

// Crear una nueva programación de fumigación
router.post("/", createFumigacion);

// Marcar una fumigación como "Realizado"
router.put("/:id/realizada", marcarRealizada);

export default router;