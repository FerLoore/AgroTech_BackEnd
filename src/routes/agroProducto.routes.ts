import { Router } from "express";
import {
    getAgroProductos,
    getAgroProductoById,
    createAgroProducto,
    updateAgroProducto,
    deleteAgroProducto
} from "../handlers/agroProducto.handler";

const router = Router();

// GET    /api/agro-producto           → lista todos los productos activos
// GET    /api/agro-producto?tipo=X    → filtra por tipo
// GET    /api/agro-producto/:id       → obtiene un producto por ID
// POST   /api/agro-producto           → crea un nuevo producto
// PUT    /api/agro-producto/:id       → actualiza un producto
// DELETE /api/agro-producto/:id       → borrado lógico (produ_activo = 0)

router.get("/",       getAgroProductos);
router.get("/:id",    getAgroProductoById);
router.post("/",      createAgroProducto);
router.put("/:id",    updateAgroProducto);
router.delete("/:id", deleteAgroProducto);

export default router;