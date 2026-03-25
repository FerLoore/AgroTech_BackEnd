import { Router } from "express";
import { getAgroAuditorias } from "../handlers/agroAuditoria.handler";

const router = Router();

router.get("/", getAgroAuditorias);

export default router;