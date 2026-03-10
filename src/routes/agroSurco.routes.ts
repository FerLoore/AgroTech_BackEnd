import { Router } from "express";
import {
    getAgroSurcos,
    getAgroSurcoById,
    createAgroSurco,
    updateAgroSurco,
    deleteAgroSurco
} from "../handlers/agroSurco.handler";

const router = Router();

router.get("/", getAgroSurcos);
router.get("/:id", getAgroSurcoById);
router.post("/", createAgroSurco);
router.put("/:id", updateAgroSurco);
router.delete("/:id", deleteAgroSurco);

export default router;