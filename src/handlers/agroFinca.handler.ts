import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroFinca } from "../entities/AgroFinca";

const agroFincaRepo = AppDataSource.getRepository(AgroFinca);

// ─────────────────────────────────────────────────────────────
// GET /api/agro-finca
// Lista todas las fincas ACTIVAS + Nombre del Dueño
// ─────────────────────────────────────────────────────────────
export const getAgroFincas = async (req: Request, res: Response) => {
    try {
        const fincas = await agroFincaRepo.createQueryBuilder("f")
            .leftJoin("AGRO_USUARIO", "u", "f.usu_usuario = u.USU_USUARIO")
            .select([
                "f.fin_finca      AS \"fin_finca\"",
                "f.fin_nombre     AS \"fin_nombre\"",
                "f.fin_ubicacion  AS \"fin_ubicacion\"",
                "f.fin_hectarea   AS \"fin_hectarea\"",
                "f.usu_usuario    AS \"usu_usuario\"",
                "f.fin_activo     AS \"fin_activo\"",
                "f.fin_latitud_origen  AS \"fin_latitud_origen\"",
                "f.fin_longitud_origen AS \"fin_longitud_origen\"",
                "u.USU_NOMBRE     AS \"usu_nombre\""
            ])
            .where("f.fin_activo = :activo", { activo: 1 })
            .orderBy("f.fin_finca", "ASC")
            .getRawMany();

        res.json({ ok: true, fincas });
    } catch (error) {
        console.error("ERROR EN GET FINCAS:", error);
        res.status(500).json({ ok: false, message: "Error al obtener las fincas", error });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/agro-finca/:id
// ─────────────────────────────────────────────────────────────
export const getAgroFincaById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const finca = await agroFincaRepo.createQueryBuilder("f")
            .leftJoin("AGRO_USUARIO", "u", "f.usu_usuario = u.USU_USUARIO")
            .select([
                "f.fin_finca      AS \"fin_finca\"",
                "f.fin_nombre     AS \"fin_nombre\"",
                "f.fin_ubicacion  AS \"fin_ubicacion\"",
                "f.fin_hectarea   AS \"fin_hectarea\"",
                "f.usu_usuario    AS \"usu_usuario\"",
                "f.fin_activo     AS \"fin_activo\"",
                "f.fin_latitud_origen  AS \"fin_latitud_origen\"",
                "f.fin_longitud_origen AS \"fin_longitud_origen\"",
                "u.USU_NOMBRE     AS \"usu_nombre\""
            ])
            .where("f.fin_finca = :id", { id: Number(id) })
            .andWhere("f.fin_activo = :activo", { activo: 1 })
            .getRawOne();

        if (!finca) {
            return res.status(404).json({ ok: false, message: `Finca con ID ${id} no encontrada o inactiva` });
        }

        res.json({ ok: true, finca });
    } catch (error) {
        console.error("ERROR EN GET FINCA BY ID:", error);
        res.status(500).json({ ok: false, message: "Error al obtener la finca", error });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/agro-finca
// ─────────────────────────────────────────────────────────────
export const createAgroFinca = async (req: Request, res: Response) => {
    try {
        const { fin_nombre, fin_ubicacion, fin_hectarea, usu_usuario } = req.body;

        if (!fin_nombre || !usu_usuario) {
            return res.status(400).json({ 
                ok: false, 
                message: "Los campos fin_nombre y usu_usuario son obligatorios" 
            });
        }

        const nuevaFinca = agroFincaRepo.create({
            fin_nombre,
            fin_ubicacion: fin_ubicacion || null,
            fin_hectarea: fin_hectarea !== undefined ? Number(fin_hectarea) : null,
            usu_usuario: Number(usu_usuario),
            fin_activo: 1
        });

        await agroFincaRepo.save(nuevaFinca);

        res.status(201).json({ ok: true, message: "Finca creada exitosamente", finca: nuevaFinca });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al crear la finca", error });
    }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/agro-finca/:id
// ─────────────────────────────────────────────────────────────
export const updateAgroFinca = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { fin_nombre, fin_ubicacion, fin_hectarea, usu_usuario, fin_latitud_origen, fin_longitud_origen } = req.body;

        const finca = await agroFincaRepo.findOne({
            where: { fin_finca: Number(id), fin_activo: 1 }
        });

        if (!finca) {
            return res.status(404).json({ ok: false, message: `Finca con ID ${id} no encontrada` });
        }

        if (fin_nombre !== undefined) finca.fin_nombre = fin_nombre;
        if (fin_ubicacion !== undefined) finca.fin_ubicacion = fin_ubicacion;
        if (fin_hectarea !== undefined) finca.fin_hectarea = Number(fin_hectarea);
        if (usu_usuario !== undefined) finca.usu_usuario = Number(usu_usuario);
        if (fin_latitud_origen !== undefined) finca.fin_latitud_origen = Number(fin_latitud_origen);
        if (fin_longitud_origen !== undefined) finca.fin_longitud_origen = Number(fin_longitud_origen);

        await agroFincaRepo.save(finca);

        res.json({ ok: true, message: "Finca actualizada exitosamente", finca });
    } catch (error: any) {
        console.error("ERROR EN UPDATE FINCA:", error);
        res.status(500).json({ ok: false, message: "Error al actualizar la finca", error: error.message || error });
    }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/agro-finca/:id (Borrado Lógico)
// ─────────────────────────────────────────────────────────────
export const deleteAgroFinca = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const finca = await agroFincaRepo.findOne({
            where: { fin_finca: Number(id), fin_activo: 1 }
        });

        if (!finca) {
            return res.status(404).json({ ok: false, message: `Finca con ID ${id} no encontrada` });
        }

        // Desactivamos la finca en lugar de borrarla
        finca.fin_activo = 0;
        await agroFincaRepo.save(finca);

        res.json({ ok: true, message: "Finca desactivada exitosamente" });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al desactivar la finca", error });
    }
};