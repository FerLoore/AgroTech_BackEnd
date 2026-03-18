import { Router } from "express";
import agroRolRoutes from "./routes/agroRol.routes";
import agroSurcoRoutes from "./routes/agroSurco.routes";
import agroArbolRoutes from "./routes/agroArbol.routes";
import agroHistorialRoutes from "./routes/agroHistorial.routes";
import agroTipoArbolRoutes from "./routes/agroTipoArbol.routes";
import agroCatalogoPatogenoRoutes from "./routes/agroCatalogoPatogeno.routes";
import agroProductoRoutes from "./routes/agroProducto.routes";
import agroAlertaSaludRoutes from "./routes/agroAlertaSalud.routes";
import agroAnalisisLaboratorioRoutes from "./routes/agroAnalisisLaboratorio.routes";
import agroTratamientosRoutes from "./routes/agroTratamientos.routes";
import agroClimaRoutes  from "./routes/agroCLima.routes";
import agroFincaRoutes from "./routes/agroFinca.routes";
import agroUsuarioRoutes from "./routes/agroUsuario.routes";
import agroSeccionRoutes from "./routes/agroSeccion.routes";

// Cada dev agrega su línea aquí al terminar su módulo
// Dev 1 → agroRol, agroTipoArbol, agroCatalogoPatogeno, agroProducto
// Dev 2 → agroUsuario, agroFinca, agroSeccion, agroClima
// Dev 3 → agroSurco, agroArbol, agroHistorial
// Dev 4 → agroAlertaSalud, agroAnalisisLaboratorio, agroTratamientos

const router = Router();



// Dev 1 → agroRol, agroTipoArbol, agroCatalogoPatogeno, agroProducto
router.use("/agro-roles", agroRolRoutes);
router.use("/agro-tipo-arbol", agroTipoArbolRoutes);
router.use("/agro-catalogo-patogeno", agroCatalogoPatogenoRoutes);
router.use("/agro-producto", agroProductoRoutes);

// Dev 2 → agroUsuario, agroFinca, agroSeccion, agroClima
router.use("/agro-usuario", agroUsuarioRoutes);
router.use("/agro-finca", agroFincaRoutes);
router.use("/agro-seccion", agroSeccionRoutes);
router.use("/agro-clima", agroClimaRoutes);
 
// Dev 4 -> agroAlertaSalud, agroAnalisisLaboratorio, agroTratamientos
router.use("/agro-alerta-salud", agroAlertaSaludRoutes);
router.use("/agro-analisis-laboratorio", agroAnalisisLaboratorioRoutes);
router.use("/agro-tratamientos", agroTratamientosRoutes);



// Dev 3 → agroSurco, agroArbol, agroHistorial
router.use("/agro-surcos", agroSurcoRoutes);
router.use("/agro-arboles", agroArbolRoutes);
router.use("/agro-historial", agroHistorialRoutes);
export default router;