import { Router } from "express";
import * as maintenanceHandler from "../handlers/agroMantenimiento.handler";

const router = Router();

router.get("/", maintenanceHandler.getMantenimientos);
router.post("/", maintenanceHandler.createMantenimiento);
router.put("/:id", maintenanceHandler.updateMantenimiento);
router.delete("/:id", maintenanceHandler.deleteMantenimiento);

export default router;
