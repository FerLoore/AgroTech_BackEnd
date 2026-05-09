import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroArbol } from "../entities/AgroArbol";
import { AgroFinca } from "../entities/AgroFinca";


const agroArbolRepo = AppDataSource.getRepository(AgroArbol);





// ─────────────────────────────────────────
// GET - listar árboles
// ─────────────────────────────────────────
export const getAgroArboles = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;
        const skip = (page - 1) * limit;

        const [arboles, total] = await agroArbolRepo.findAndCount({
            where: { arb_activo: 1 },
            skip: skip,
            take: limit,
            order: { arb_arbol: 'DESC' }
        });

        res.json({
            ok: true,
            arboles,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error al obtener los árboles",
            error
        });
    }
};

// ─────────────────────────────────────────
// GET - árbol por ID
// ─────────────────────────────────────────
export const getAgroArbolById = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        const arbol = await agroArbolRepo.findOne({
            where: {
                arb_arbol: Number(id),
                arb_activo: 1
            }
        });

        if (!arbol) {
            return res.status(404).json({
                ok: false,
                message: `Árbol con ID ${id} no encontrado`
            });
        }

        res.json({
            ok: true,
            arbol
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error al obtener el árbol",
            error
        });
    }
};

// ─────────────────────────────────────────
// POST - crear árbol + historial
// ─────────────────────────────────────────
export const createAgroArbol = async (req: Request, res: Response) => {
    try {
        const {
            arb_posicion_surco,
            arb_fecha_siembra,
            tipar_tipo_arbol,
            arb_estado,
            sur_surcos
        } = req.body;

        // Log para ver qué está llegando realmente desde el front
        console.log("Recibiendo árbol:", req.body);

        // Validación más permisiva: permitimos que arb_fecha_siembra pueda ser opcional 
        // si la base de datos tiene un default, o la manejamos aquí.
        if (
            arb_posicion_surco == null ||
            tipar_tipo_arbol == null ||
            sur_surcos == null
        ) {
            return res.status(400).json({
                ok: false,
                message: "Faltan campos obligatorios: posicion, tipo o surco"
            });
        }

        const estadoInicial = arb_estado || "Crecimiento";

        // Si la fecha llega vacía, usamos la fecha actual del servidor
        const fechaFinal = arb_fecha_siembra ? new Date(arb_fecha_siembra) : new Date();

        const nuevoArbol = agroArbolRepo.create({
            arb_posicion_surco: Number(arb_posicion_surco),
            arb_fecha_siembra: fechaFinal,
            tipar_tipo_arbol: Number(tipar_tipo_arbol),
            sur_surcos: Number(sur_surcos),
            arb_estado: estadoInicial,
            arb_activo: 1
        });

        await agroArbolRepo.save(nuevoArbol);

        res.status(201).json({
            ok: true,
            message: "Árbol creado exitosamente",
            arbol: nuevoArbol
        });

    } catch (error: any) {
        console.error("ERROR AL CREAR ÁRBOL:", error);
        res.status(500).json({
            ok: false,
            message: "Error al crear el árbol",
            error: error.message
        });
    }
};


// ─────────────────────────────────────────
// PUT - actualizar árbol + historial si cambia estado
// ─────────────────────────────────────────
export const updateAgroArbol = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const arbol = await agroArbolRepo.findOne({
            where: { arb_arbol: Number(id) }
        });

        if (!arbol) {
            return res.status(404).json({
                ok: false,
                message: "Árbol no encontrado"
            });
        }

        const {
            arb_posicion_surco,
            arb_fecha_siembra,
            tipar_tipo_arbol,
            arb_estado,
            sur_surcos
        } = req.body;

        // ───── CAMPOS NORMALES ─────
        if (arb_posicion_surco !== undefined) {
            arbol.arb_posicion_surco = Number(arb_posicion_surco);
        }

        if (arb_fecha_siembra !== undefined) {
            arbol.arb_fecha_siembra = arb_fecha_siembra;
        }

        if (tipar_tipo_arbol !== undefined) {
            arbol.tipar_tipo_arbol = Number(tipar_tipo_arbol);
        }

        if (sur_surcos !== undefined) {
            arbol.sur_surcos = Number(sur_surcos);
        }

        // ───── ESTADO ─────

        const estadoNuevo = arb_estado || arbol.arb_estado;
        if (estadoNuevo && estadoNuevo !== arbol.arb_estado) {


            arbol.arb_estado = estadoNuevo;
        }

        // GUARDAR SIEMPRE
        await agroArbolRepo.save(arbol);

        res.json({
            ok: true,
            message: "Árbol actualizado correctamente"
        });

    } catch (error: any) {
        console.error("ERROR REAL:", error);

        res.status(500).json({
            ok: false,
            message: "Error al actualizar",
            error: error.message
        });
    }
};

// ─────────────────────────────────────────
// DELETE - borrado lógico + historial
// ─────────────────────────────────────────
export const deleteAgroArbol = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        const arbol = await agroArbolRepo.findOne({
            where: { arb_arbol: Number(id) }
        });

        if (!arbol) {
            return res.status(404).json({
                ok: false,
                message: "Árbol no encontrado"
            });
        }

        // borrado lógico
        arbol.arb_activo = 0;
        await agroArbolRepo.save(arbol);



        res.json({
            ok: true,
            message: "Árbol eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error al eliminar",
            error
        });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /agro-arboles/cuarentena/:fincaId
// Opción A — Solo lectura, sin modificar la BD.
// Calcula dinámicamente qué árboles están dentro del radio de
// cuarentena (≤ 10 metros) de un árbol enfermo, usando las
// coordenadas calculadas a partir del mapa de la finca.
// ─────────────────────────────────────────────────────────────
const DISTANCIA_CUARENTENA_M = 10; // metros
const METROS_POR_GRADO = 0.000009;

// Haversine en metros
function haversineMetros(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const getArbolesEnCuarentena = async (req: Request, res: Response) => {
    try {
        const fincaId = Number(req.params.fincaId);
        if (isNaN(fincaId) || fincaId <= 0) {
            return res.status(400).json({ ok: false, message: "fincaId inválido" });
        }

        // 1. Obtener finca (necesitamos el origen para calcular lat/lng)
        const fincaRepo = AppDataSource.getRepository(AgroFinca);
        const finca = await fincaRepo.findOneBy({ fin_finca: fincaId, fin_activo: 1 });

        if (!finca || finca.fin_latitud_origen == null || finca.fin_longitud_origen == null) {
            return res.status(400).json({
                ok: false,
                message: "Finca no encontrada o sin coordenadas de origen",
                arboles_cuarentena: []
            });
        }

        const latOrigen = finca.fin_latitud_origen;
        const lngOrigen = finca.fin_longitud_origen;

        // 2. Obtener todos los árboles activos de esta finca con su espaciamiento
        const arbolesRaw = await AppDataSource.query(`
            SELECT
                A.ARB_ARBOL          AS "id",
                A.ARB_ESTADO         AS "estado",
                A.ARB_POSICION_SURCO AS "posicion_surco",
                S.SUR_NUMERO_SURCO   AS "numero_surco",
                S.SUR_ESPACIAMIENTO  AS "espaciamiento"
            FROM AGRO_ARBOL A
            JOIN AGRO_SURCO   S   ON A.SUR_SURCOS    = S.SUR_SURCO
            JOIN AGRO_SECCION SEC ON S.SECC_SECCIONES = SEC.SECC_SECCION
            WHERE SEC.FIN_FINCA = :fincaId
              AND A.ARB_ACTIVO  = 1
              AND SEC.SECC_ACTIVO = 1
              AND S.SUR_ACTIVO  = 1
        `, [fincaId]);

        // 3. Calcular lat/lng de cada árbol
        interface ArbolGeo {
            id: number;
            estado: string;
            lat: number;
            lng: number;
        }
        const arbolesGeo: ArbolGeo[] = arbolesRaw.map((a: any) => {
            const esp = Number(a.espaciamiento) || 2;
            return {
                id: Number(a.id),
                estado: a.estado,
                lat: latOrigen + (Number(a.posicion_surco) * esp * METROS_POR_GRADO),
                lng: lngOrigen + (Number(a.numero_surco) * esp * METROS_POR_GRADO),
            };
        });

        // 4. Identificar enfermos
        const enfermos = arbolesGeo.filter(a => a.estado === "Enfermo");

        if (enfermos.length === 0) {
            return res.json({ ok: true, arboles_cuarentena: [] });
        }

        // 5. Para cada árbol NO enfermo, verificar si está a ≤ 10m de algún enfermo
        const idsEnCuarentena: number[] = arbolesGeo
            .filter(a => a.estado !== "Enfermo")
            .filter(a =>
                enfermos.some(e =>
                    haversineMetros(a.lat, a.lng, e.lat, e.lng) <= DISTANCIA_CUARENTENA_M
                )
            )
            .map(a => a.id);

        return res.json({
            ok: true,
            arboles_cuarentena: idsEnCuarentena,
            total: idsEnCuarentena.length,
            radio_metros: DISTANCIA_CUARENTENA_M
        });

    } catch (error) {
        console.error("Error al calcular cuarentena:", error);
        return res.status(500).json({
            ok: false,
            message: "Error al calcular la cuarentena",
            error
        });
    }
};
