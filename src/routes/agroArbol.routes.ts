import { Router } from "express";
import {
    getAgroArboles,
    getAgroArbolById,
    createAgroArbol,
    updateAgroArbol,
    deleteAgroArbol,
    getArbolesEnCuarentena,
} from "../handlers/agroArbol.handler";

const router = Router();

router.get("/", getAgroArboles);
// IMPORTANTE: la ruta específica debe ir ANTES de /:id para que Express no confunda "cuarentena" con un ID
router.get("/cuarentena/:fincaId", getArbolesEnCuarentena);
router.get("/:id", getAgroArbolById);
router.post("/", createAgroArbol);
router.put("/:id", updateAgroArbol);
router.delete("/:id", deleteAgroArbol);

export default router;