import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroFinca } from "../entities/AgroFinca";
import { AgroFincaPerimetro } from "../entities/AgroFincaPerimetro";

// ─────────────────────────────────────────────────────────────
// GET /agro-finca-mapa/:fincaId
// Devuelve finca + perímetro + árboles con lat/lng calculada
// ─────────────────────────────────────────────────────────────
export const getMapaFincaCompleto = async (req: Request, res: Response) => {
    try {
        const fincaId = Number(req.params.fincaId);

        // 1. Finca
        const fincaRepo = AppDataSource.getRepository(AgroFinca);
        const finca = await fincaRepo.findOneBy({ fin_finca: fincaId, fin_activo: 1 });

        if (!finca) {
            return res.status(404).json({ ok: false, message: "Finca no encontrada o inactiva." });
        }

        if (finca.fin_latitud_origen == null || finca.fin_longitud_origen == null) {
            return res.status(400).json({
                ok: false,
                message: "La finca no tiene coordenadas de origen configuradas. Actualiza FIN_LATITUD_ORIGEN y FIN_LONGITUD_ORIGEN."
            });
        }

        // 2. Perímetro
        const perimetroRepo = AppDataSource.getRepository(AgroFincaPerimetro);
        const perimetro = await perimetroRepo.find({
            where: { fin_finca: fincaId },
            order: { perim_orden: "ASC" }
        });

        // 3. Árboles con join completo — incluye SUR_ESPACIAMIENTO real de cada surco
        // ✅ Se usa SUR_ESPACIAMIENTO de la BDD, no un valor fijo hardcodeado
        const arbolesRaw = await AppDataSource.query(`
            SELECT
                A.ARB_ARBOL          AS "id",
                A.ARB_ESTADO         AS "estado",
                A.ARB_POSICION_SURCO AS "posicion_surco",
                A.ARB_FECHA_SIEMBRA  AS "fecha_siembra",
                S.SUR_NUMERO_SURCO   AS "numero_surco",
                S.SUR_ESPACIAMIENTO  AS "espaciamiento",
                SEC.SECC_NOMBRE      AS "seccion_nombre",
                SEC.SECC_SECCION     AS "seccion_id",
                T.TIPAR_NOMBRE_COMUN AS "variedad"
            FROM AGRO_ARBOL A
            JOIN AGRO_SURCO   S   ON A.SUR_SURCOS        = S.SUR_SURCO
            JOIN AGRO_SECCION SEC ON S.SECC_SECCIONES     = SEC.SECC_SECCION
            JOIN AGRO_TIPO_ARBOL T ON A.TIPAR_TIPO_ARBOL  = T.TIPAR_TIPO_ARBOL
            WHERE SEC.FIN_FINCA = :fincaId
              AND A.ARB_ACTIVO  = 1
              AND SEC.SECC_ACTIVO = 1
              AND S.SUR_ACTIVO = 1
            ORDER BY S.SUR_NUMERO_SURCO, A.ARB_POSICION_SURCO
        `, [fincaId]);

        // 4. Calcular lat/lng de cada árbol
        // ✅ Fórmula correcta: usa el espaciamiento REAL del surco desde la BDD
        // 1 metro ≈ 0.000009 grados
        const METROS_POR_GRADO = 0.000009;
        const latOrigen = finca.fin_latitud_origen;
        const lngOrigen = finca.fin_longitud_origen;

        const arboles = arbolesRaw.map((a: any) => {
            const esp = Number(a.espaciamiento) || 2; // fallback 2m si no tiene espaciamiento
            return {
                id: a.id,
                estado: a.estado,
                posicion_surco: a.posicion_surco,
                numero_surco: a.numero_surco,
                seccion_nombre: a.seccion_nombre,
                seccion_id: a.seccion_id,
                variedad: a.variedad,
                fecha_siembra: a.fecha_siembra,
                referencia: `S${a.numero_surco}-P${a.posicion_surco}`,
                lat: latOrigen + (Number(a.posicion_surco) * esp * METROS_POR_GRADO),
                lng: lngOrigen + (Number(a.numero_surco) * esp * METROS_POR_GRADO),
            };
        });

        res.json({
            ok: true,
            finca,
            perimetro: perimetro.map(p => ({
                orden: p.perim_orden,
                lat: p.perim_latitud,
                lng: p.perim_longitud,
                seccion_id: p.secc_seccion,
            })),
            arboles,
        });

    } catch (error) {
        console.error("Error al obtener mapa:", error);
        res.status(500).json({ ok: false, message: "Error interno del servidor", error });
    }
};