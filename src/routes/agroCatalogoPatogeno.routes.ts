import { Router } from "express";
import {
    getAgroCatalogoPatogenos,
    getAgroCatalogoPatogenoById,
    createAgroCatalogoPatogeno,
    updateAgroCatalogoPatogeno,
    deleteAgroCatalogoPatogeno
} from "../handlers/agroCatalogoPatogeno.handler";

const router = Router();

// GET    /api/agro-catalogo-patogeno          → lista todos los patógenos activos
// GET    /api/agro-catalogo-patogeno?tipo=Hongo → filtra por tipo
// GET    /api/agro-catalogo-patogeno/:id       → obtiene un patógeno por ID
// POST   /api/agro-catalogo-patogeno           → crea un nuevo patógeno
// PUT    /api/agro-catalogo-patogeno/:id        → actualiza un patógeno
// DELETE /api/agro-catalogo-patogeno/:id        → borrado lógico (catpato_activo = 0)

router.get("/",       getAgroCatalogoPatogenos);
router.get("/:id",    getAgroCatalogoPatogenoById);
router.post("/",      createAgroCatalogoPatogeno);
router.put("/:id",    updateAgroCatalogoPatogeno);
router.delete("/:id", deleteAgroCatalogoPatogeno);

export default router;