import { Router } from "express";
import {
    getAgroRoles,
    getAgroRolById,
    createAgroRol,
    updateAgroRol,
    deleteAgroRol
} from "../handlers/agroRol.handler";

const router = Router();

// GET    /api/agro-roles        → lista todos los roles activos
// GET    /api/agro-roles/:id    → obtiene un rol por ID
// POST   /api/agro-roles        → crea un nuevo rol
// PUT    /api/agro-roles/:id    → actualiza un rol
// DELETE /api/agro-roles/:id    → borrado lógico (rol_activo = 0)

router.get("/",       getAgroRoles);
router.get("/:id",    getAgroRolById);
router.post("/",      createAgroRol);
router.put("/:id",    updateAgroRol);
router.delete("/:id", deleteAgroRol);

export default router;