import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroFinca } from "../entities/AgroFinca";
import { AgroFincaPerimetro } from "../entities/AgroFincaPerimetro";
import { AgroArbol } from "../entities/AgroArbol";

export const getMapaFincaCompleto = async (req: Request, res: Response) => {
    try {
        const fincaId = Number(req.params.fincaId);

        // 1. Obtener la Finca
        const fincaRepo = AppDataSource.getRepository(AgroFinca);
        const finca = await fincaRepo.findOneBy({ fin_finca: fincaId, fin_activo: 1 });

        if (!finca) {
            return res.status(404).json({ message: "Finca no encontrada o inactiva." });
        }

        // 2. Obtener el Perímetro (ordenado)
        const perimetroRepo = AppDataSource.getRepository(AgroFincaPerimetro);
        const perimetro = await perimetroRepo.find({
            where: { fin_finca: fincaId },
            order: { perim_orden: "ASC" } // Vital para dibujar el polígono correctamente
        });

        // 3. Obtener los Árboles de la finca (via Surco -> Seccion -> Finca)
        // Nota: TypeORM permite usar QueryBuilder para joins más complejos
        const arbolesRaw = await AppDataSource.query(`
            SELECT 
                A.ARB_ARBOL as id,
                A.ARB_ESTADO as estado,
                A.ARB_POSICION_SURCO as posicion_surco,
                S.SUR_NUMERO_SURCO as numero_surco,
                SEC.SECC_NOMBRE as seccion_nombre,
                T.TIPAR_NOMBRE_COMUN as variedad
            FROM AGRO_ARBOL A
            JOIN AGRO_SURCO S ON A.SUR_SURCOS = S.SUR_SURCO
            JOIN AGRO_SECCION SEC ON S.SECC_SECCIONES = SEC.SECC_SECCION
            JOIN AGRO_TIPO_ARBOL T ON A.TIPAR_TIPO_ARBOL = T.TIPAR_TIPO_ARBOL
            WHERE SEC.FIN_FINCA = :fincaId AND A.ARB_ACTIVO = 1
        `, [fincaId]);

        // 4. Calcular coordenadas de cada árbol basado en el origen de la finca
        // Esta es una simulación matemática simplificada para el mapa. 
        // 1 grado lat/lng ~ 111km. 0.00001 ~ 1.1 metros
        const latOrigen = finca.fin_latitud_origen || 0;
        const lngOrigen = finca.fin_longitud_origen || 0;

        const arbolesConUbicacion = arbolesRaw.map((arbol: any) => {
            // Lógica de espaciamiento simulada: 
            // Distancia entre surcos = 3m (latitud), Distancia entre árboles = 2m (longitud)
            const offsetLat = (arbol.numero_surco * 3) * 0.000009;
            const offsetLng = (arbol.posicion_surco * 2) * 0.000009;

            return {
                ...arbol,
                lat: latOrigen + offsetLat,
                lng: lngOrigen + offsetLng
            };
        });

        // Respuesta unificada para el frontend
        res.json({
            finca: finca,
            perimetro: perimetro.map(p => ({ lat: p.perim_latitud, lng: p.perim_longitud })),
            arboles: arbolesConUbicacion
        });

    } catch (error) {
        console.error("Error al obtener mapa:", error);
        res.status(500).json({ message: "Error interno del servidor", error });
    }
};