import { Router } from "express";
import { getPerimetro, guardarPerimetro, deletePerimetro } from "../handlers/agroFincaPerimetro.handler";

const router = Router();

router.get("/:fincaId", getPerimetro);
router.post("/:fincaId", guardarPerimetro);
router.delete("/:fincaId", deletePerimetro);

export default router;