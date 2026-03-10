import { Router } from "express";
import agroRolRoutes from "./routes/agroRol.routes";
import agroSurcoRoutes from "./routes/agroSurco.routes";

// Cada dev agrega su línea aquí al terminar su módulo
// Dev 1 → agroRol, agroTipoArbol, agroCatalogoPatogeno, agroProducto
// Dev 2 → agroUsuario, agroFinca, agroSeccion, agroClima
// Dev 3 → agroSurco, agroArbol, agroHistorial
// Dev 4 → agroAlertaSalud, agroAnalisisLaboratorio, agroTratamientos

const router = Router();


router.use("/agro-roles", agroRolRoutes);
router.use("/agro-surcos", agroSurcoRoutes);
export default router;