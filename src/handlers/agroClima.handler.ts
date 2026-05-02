import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroClima } from "../entities/AgroClima";

const agroClimaRepo = AppDataSource.getRepository(AgroClima);

// ─────────────────────────────────────────────────────────────
// GET /api/agro-clima
// Lista todos los registros climáticos
// Query params opcionales: ?seccionId=1 (Para filtrar)
// ─────────────────────────────────────────────────────────────
export const getAgroClimas = async (req: Request, res: Response) => {
    try {
        const { seccionId } = req.query;

        // Hacemos JOIN con AGRO_SECCION para obtener el nombre de la sección
        let query = agroClimaRepo.createQueryBuilder("c")
            .leftJoin("AGRO_SECCION", "s", "c.secc_seccion = s.SECC_SECCION")
            .select([
                "c.clim_clima           AS \"clim_clima\"",
                "c.clim_fecha           AS \"clim_fecha\"",
                "c.clim_temperatura     AS \"clim_temperatura\"",
                "c.clim_humedad_relativa AS \"clim_humedad_relativa\"",
                "c.clim_precipitacion   AS \"clim_precipitacion\"",
                "c.secc_seccion         AS \"secc_seccion\"",
                "s.SECC_NOMBRE          AS \"secc_nombre\"",
            ])
            .orderBy("c.clim_fecha", "DESC");

        if (seccionId) {
            query = query.where("c.secc_seccion = :seccionId", { seccionId: Number(seccionId) });
        }

        const climas = await query.getRawMany();

        res.json({ ok: true, climas });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al obtener registros climáticos", error });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/agro-clima/:id
// ─────────────────────────────────────────────────────────────
export const getAgroClimaById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const clima = await agroClimaRepo.findOne({
            where: { clim_clima: Number(id) }
        });

        if (!clima) {
            return res.status(404).json({
                ok: false,
                message: `Registro climático con ID ${id} no encontrado`
            });
        }

        res.json({ ok: true, clima });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al obtener el registro climático", error });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/agro-clima
// Body: { clim_temperatura, clim_humedad_relativa, clim_precipitacion, seccionId }
// ─────────────────────────────────────────────────────────────
export const createAgroClima = async (req: Request, res: Response) => {
    try {
        const {
            clim_temperatura,
            clim_humedad_relativa,
            clim_precipitacion,
            seccionId
        } = req.body;

        if (!seccionId) {
            return res.status(400).json({
                ok: false,
                message: "El campo seccionId es obligatorio"
            });
        }

        // Creamos la instancia asignando el número directamente a secc_seccion
        const nuevoClima = agroClimaRepo.create({
            clim_temperatura: clim_temperatura !== undefined ? Number(clim_temperatura) : null,
            clim_humedad_relativa: clim_humedad_relativa !== undefined ? Number(clim_humedad_relativa) : null,
            clim_precipitacion: clim_precipitacion !== undefined ? Number(clim_precipitacion) : null,
            secc_seccion: Number(seccionId) 
        });

        await agroClimaRepo.save(nuevoClima);

        res.status(201).json({
            ok: true,
            message: "Registro climático creado exitosamente",
            clima: nuevoClima
        });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al crear el registro climático", error });
    }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/agro-clima/:id
// Body: { clim_temperatura, clim_humedad_relativa, clim_precipitacion, seccionId }
// ─────────────────────────────────────────────────────────────
export const updateAgroClima = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            clim_temperatura,
            clim_humedad_relativa,
            clim_precipitacion,
            seccionId
        } = req.body;

        const clima = await agroClimaRepo.findOne({
            where: { clim_clima: Number(id) }
        });

        if (!clima) {
            return res.status(404).json({
                ok: false,
                message: `Registro climático con ID ${id} no encontrado`
            });
        }

        // Actualiza solo los campos que vienen en el body
        if (clim_temperatura !== undefined) clima.clim_temperatura = Number(clim_temperatura);
        if (clim_humedad_relativa !== undefined) clima.clim_humedad_relativa = Number(clim_humedad_relativa);
        if (clim_precipitacion !== undefined) clima.clim_precipitacion = Number(clim_precipitacion);
        if (seccionId !== undefined) clima.secc_seccion = Number(seccionId);

        await agroClimaRepo.save(clima);

        res.json({
            ok: true,
            message: "Registro climático actualizado exitosamente",
            clima
        });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al actualizar el registro climático", error });
    }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/agro-clima/:id
// ─────────────────────────────────────────────────────────────
export const deleteAgroClima = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const clima = await agroClimaRepo.findOne({
            where: { clim_clima: Number(id) }
        });

        if (!clima) {
            return res.status(404).json({
                ok: false,
                message: `Registro climático con ID ${id} no encontrado`
            });
        }

        await agroClimaRepo.remove(clima);

        res.json({ ok: true, message: "Registro climático eliminado exitosamente" });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al eliminar el registro climático", error });
    }
};