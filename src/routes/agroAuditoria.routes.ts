import { Router } from "express";
import { getAgroAuditorias, getAuditoriaById } from "../handlers/agroAuditoria.handler";

const router = Router();

router.get("/", getAgroAuditorias);
router.get("/:id", getAuditoriaById);

export default router;