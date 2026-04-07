import { Router } from "express";
import {
    getAgroArboles,
    getAgroArbolById,
    createAgroArbol,
    updateAgroArbol,
    deleteAgroArbol,
    
} from "../handlers/agroArbol.handler";

const router = Router();

router.get("/", getAgroArboles);
router.get("/:id", getAgroArbolById);
router.post("/", createAgroArbol);
router.put("/:id", updateAgroArbol);
router.delete("/:id", deleteAgroArbol);

export default router;