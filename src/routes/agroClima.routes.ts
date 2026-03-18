import { Router } from "express";
import {
    getAgroClimas,
    getAgroClimaById,
    createAgroClima,
    updateAgroClima,
    deleteAgroClima
} from "../handlers/agroClima.handler"; // <-- Verifica que esta ruta coincida con tu carpeta de controladores

const router = Router();

// ─────────────────────────────────────────────────────────────
// RUTAS PARA EL MÓDULO CLIMÁTICO (AGRO_CLIMA)
// El prefijo '/api/agro-clima' se configurará en tu app.ts principal
// ─────────────────────────────────────────────────────────────

// Obtener todos los registros climáticos (Puedes filtrar usando ?seccionId=X)
router.get("/", getAgroClimas);

// Obtener un registro climático específico por su ID
router.get("/:id", getAgroClimaById);

// Crear un nuevo registro climático
router.post("/", createAgroClima);

// Actualizar un registro climático existente
router.put("/:id", updateAgroClima);

// Eliminar un registro climático de la base de datos
router.delete("/:id", deleteAgroClima);

export default router;