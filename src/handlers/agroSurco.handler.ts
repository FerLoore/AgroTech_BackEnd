import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroSurco } from "../entities/AgroSurco";

const agroSurcoRepo = AppDataSource.getRepository(AgroSurco);

// ─────────────────────────────────────────────
// GET /api/agro-surcos
// ─────────────────────────────────────────────
export const getAgroSurcos = async (req: Request, res: Response) => {
    try {

        const surcos = await agroSurcoRepo.find({
            where: { sur_activo: 1 },
            order: { sur_numero_surco: "ASC" }
        });

        res.json({ ok: true, surcos });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al obtener surcos", error });
    }
};

// ─────────────────────────────────────────────
// GET /api/agro-surcos/:id
// ─────────────────────────────────────────────
export const getAgroSurcoById = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const surco = await agroSurcoRepo.findOne({
            where: { sur_surco: Number(id), sur_activo: 1 }
        });

        if (!surco) {
            return res.status(404).json({
                ok: false,
                message: `Surco con ID ${id} no encontrado`
            });
        }

        res.json({ ok: true, surco });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al obtener el surco", error });
    }
};

// ─────────────────────────────────────────────
// POST /api/agro-surcos
// ─────────────────────────────────────────────
// En el controlador del backend
export const createAgroSurco = async (req, res) => {
    try {
        const nuevoSurco = agroSurcoRepo.create(req.body);
        await agroSurcoRepo.save(nuevoSurco);

        // FIX CRÍTICO PARA ORACLE:
        // Buscamos el surco que acabamos de insertar para obtener el ID real generado por el Trigger
        const surcoConId = await agroSurcoRepo.findOne({
            where: {
                sur_numero_surco: req.body.sur_numero_surco,
                secc_secciones: req.body.secc_secciones
            },
            order: { sur_surco: 'DESC' } // Traer el más reciente
        });

        res.status(201).json({
            ok: true,
            surco: surcoConId // Ahora sur_surco NO será null
        });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

// ─────────────────────────────────────────────
// PUT /api/agro-surcos/:id
// ─────────────────────────────────────────────
export const updateAgroSurco = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const surco = await agroSurcoRepo.findOne({
            where: { sur_surco: Number(id) }
        });

        if (!surco) {
            return res.status(404).json({
                ok: false,
                message: `Surco con ID ${id} no encontrado`
            });
        }

        const {
            sur_numero_surco,
            sur_orientacion,
            sur_espaciamiento
        } = req.body;

        if (sur_numero_surco !== undefined)
            surco.sur_numero_surco = sur_numero_surco;

        if (sur_orientacion !== undefined)
            surco.sur_orientacion = sur_orientacion;

        if (sur_espaciamiento !== undefined)
            surco.sur_espaciamiento = sur_espaciamiento;

        await agroSurcoRepo.save(surco);

        res.json({
            ok: true,
            message: "Surco actualizado exitosamente",
            surco
        });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al actualizar el surco", error });
    }
};

// ─────────────────────────────────────────────
// DELETE /api/agro-surcos/:id
// borrado lógico
// ─────────────────────────────────────────────
export const deleteAgroSurco = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const surco = await agroSurcoRepo.findOne({
            where: { sur_surco: Number(id) }
        });

        if (!surco) {
            return res.status(404).json({
                ok: false,
                message: `Surco con ID ${id} no encontrado`
            });
        }

        surco.sur_activo = 0;

        await agroSurcoRepo.save(surco);

        res.json({
            ok: true,
            message: "Surco desactivado exitosamente"
        });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al eliminar el surco", error });
    }
};