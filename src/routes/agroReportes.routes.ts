import { Router } from "express";
import { getReportes, createReporte, deleteReporte, getReportePdf } from "../handlers/agroReportes.handler";

const router = Router();

router.get("/", getReportes);
router.post("/", createReporte);
router.get("/:id/pdf", getReportePdf);
router.delete("/:id", deleteReporte);

export default router;
