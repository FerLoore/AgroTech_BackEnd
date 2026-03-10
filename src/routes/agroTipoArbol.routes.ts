import { Router } from "express";
import {
    getAgroTipoArboles,
    getAgroTipoArbolById,
    createAgroTipoArbol,
    updateAgroTipoArbol,
    deleteAgroTipoArbol
} from "../handlers/agroTipoArbol.handler";

const router = Router();

// GET    /api/agro-tipo-arbol        → lista todos los tipos de árbol
// GET    /api/agro-tipo-arbol/:id    → obtiene un tipo por ID
// POST   /api/agro-tipo-arbol        → crea un nuevo tipo
// PUT    /api/agro-tipo-arbol/:id    → actualiza un tipo
// DELETE /api/agro-tipo-arbol/:id    → eliminación física

router.get("/",       getAgroTipoArboles);
router.get("/:id",    getAgroTipoArbolById);
router.post("/",      createAgroTipoArbol);
router.put("/:id",    updateAgroTipoArbol);
router.delete("/:id", deleteAgroTipoArbol);

export default router;