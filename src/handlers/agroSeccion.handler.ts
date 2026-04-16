import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroSeccion } from "../entities/AgroSeccion";
import { AgroSurco } from "../entities/AgroSurco";
import { AgroArbol } from "../entities/AgroArbol";
import { AgroFincaPerimetro } from "../entities/AgroFincaPerimetro";

const agroSeccionRepo = AppDataSource.getRepository(AgroSeccion);

// ─────────────────────────────────────────────────────────────
// GET /api/agro-seccion
// Lista todas las secciones ACTIVAS + Nombre de Finca
// Query params opcionales: ?fincaId=1 (Para filtrar por finca)
// ─────────────────────────────────────────────────────────────
export const getAgroSecciones = async (req: Request, res: Response) => {
    try {
        const { fincaId } = req.query;

        const query = agroSeccionRepo.createQueryBuilder("s")
            .leftJoin("AGRO_FINCA", "f", "s.fin_finca = f.FIN_FINCA")
            .select([
                "s.secc_seccion    AS \"secc_seccion\"",
                "s.secc_nombre     AS \"secc_nombre\"",
                "s.secc_tipo_suelo  AS \"secc_tipo_suelo\"",
                "s.fin_finca       AS \"fin_finca\"",
                "s.secc_activo     AS \"secc_activo\"",
                "f.FIN_NOMBRE      AS \"fin_nombre\"",
                `(SELECT COUNT(*) FROM AGRO_SURCO sur JOIN AGRO_ARBOL arb ON sur.SUR_SURCO = arb.SUR_SURCOS WHERE sur.SECC_SECCIONES = s.SECC_SECCION AND sur.SUR_ACTIVO = 1 AND arb.ARB_ACTIVO = 1) AS "tiene_arboles"`
            ])
            .where("s.secc_activo = :activo", { activo: 1 });

        if (fincaId) {
            query.andWhere("s.fin_finca = :fincaId", { fincaId: Number(fincaId) });
        }

        const secciones = await query.orderBy("s.secc_seccion", "ASC").getRawMany();

        res.json({ ok: true, secciones });
    } catch (error) {
        console.error("ERROR EN GET SECCIONES:", error);
        res.status(500).json({ ok: false, message: "Error al obtener las secciones", error });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/agro-seccion/:id
// ─────────────────────────────────────────────────────────────
export const getAgroSeccionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const seccion = await agroSeccionRepo.createQueryBuilder("s")
            .leftJoin("AGRO_FINCA", "f", "s.fin_finca = f.FIN_FINCA")
            .select([
                "s.secc_seccion    AS \"secc_seccion\"",
                "s.secc_nombre     AS \"secc_nombre\"",
                "s.secc_tipo_suelo  AS \"secc_tipo_suelo\"",
                "s.fin_finca       AS \"fin_finca\"",
                "s.secc_activo     AS \"secc_activo\"",
                "f.FIN_NOMBRE      AS \"fin_nombre\""
            ])
            .where("s.secc_seccion = :id", { id: Number(id) })
            .andWhere("s.secc_activo = :activo", { activo: 1 })
            .getRawOne();

        if (!seccion) {
            return res.status(404).json({ ok: false, message: `Sección con ID ${id} no encontrada o inactiva` });
        }

        res.json({ ok: true, seccion });
    } catch (error) {
        console.error("ERROR EN GET SECCION BY ID:", error);
        res.status(500).json({ ok: false, message: "Error al obtener la sección", error });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/agro-seccion
// ─────────────────────────────────────────────────────────────
export const createAgroSeccion = async (req: Request, res: Response) => {
    try {
        const { secc_nombre, fin_finca, secc_tipo_suelo } = req.body;

        // Validamos campos obligatorios
        if (!secc_nombre || !secc_tipo_suelo) {
            return res.status(400).json({ 
                ok: false, 
                message: "Los campos secc_nombre y secc_tipo_suelo son obligatorios" 
            });
        }

        const nuevaSeccion = agroSeccionRepo.create({
            secc_nombre,
            fin_finca: fin_finca ? Number(fin_finca) : null, // Es nullable según tu entidad
            secc_tipo_suelo,
            secc_activo: 1
        });

        await agroSeccionRepo.save(nuevaSeccion);

        res.status(201).json({ ok: true, message: "Sección creada exitosamente", seccion: nuevaSeccion });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al crear la sección", error });
    }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/agro-seccion/:id
// ─────────────────────────────────────────────────────────────
export const updateAgroSeccion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { secc_nombre, fin_finca, secc_tipo_suelo } = req.body;

        const seccion = await agroSeccionRepo.findOne({
            where: { secc_seccion: Number(id), secc_activo: 1 }
        });

        if (!seccion) {
            return res.status(404).json({ ok: false, message: `Sección con ID ${id} no encontrada` });
        }

        // Actualizamos dinámicamente
        if (secc_nombre !== undefined) seccion.secc_nombre = secc_nombre;
        if (fin_finca !== undefined) seccion.fin_finca = fin_finca ? Number(fin_finca) : null;
        if (secc_tipo_suelo !== undefined) seccion.secc_tipo_suelo = secc_tipo_suelo;

        await agroSeccionRepo.save(seccion);

        res.json({ ok: true, message: "Sección actualizada exitosamente", seccion });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al actualizar la sección", error });
    }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/agro-seccion/:id (Borrado Lógico en Cascada)
// ─────────────────────────────────────────────────────────────
export const deleteAgroSeccion = async (req: Request, res: Response) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const { id } = req.params;
        const seccionId = Number(id);

        const seccion = await queryRunner.manager.findOne(AgroSeccion, {
            where: { secc_seccion: seccionId, secc_activo: 1 }
        });

        if (!seccion) {
            return res.status(404).json({ ok: false, message: `Sección con ID ${id} no encontrada` });
        }

        // 1. Desactivar la SECCIÓN
        seccion.secc_activo = 0;
        await queryRunner.manager.save(seccion);

        // 2. Desactivar SURCOS de la sección
        await queryRunner.manager.update(AgroSurco, { secc_secciones: seccionId }, { sur_activo: 0 });

        // 3. Desactivar ÁRBOLES de esos surcos
        const surcos = await queryRunner.manager.find(AgroSurco, { where: { secc_secciones: seccionId } });
        const surcoIds = surcos.map(s => s.sur_surco);

        if (surcoIds.length > 0) {
            for (const sId of surcoIds) {
                await queryRunner.manager.update(AgroArbol, { sur_surcos: sId }, { arb_activo: 0 });
            }
        }

        // 4. Eliminar PERÍMETRO asociado a esta sección
        await queryRunner.manager.delete(AgroFincaPerimetro, { secc_seccion: seccionId });

        await queryRunner.commitTransaction();
        res.json({ ok: true, message: "Terreno (sección, surcos, árboles y perímetro) eliminado exitosamente" });

    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error("Error al eliminar terreno:", error);
        res.status(500).json({ ok: false, message: "Error al eliminar el terreno", error });
    } finally {
        await queryRunner.release();
    }
};