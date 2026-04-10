import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroHistorial } from "../entities/AgroHistorial";

const historialRepo = AppDataSource.getRepository(AgroHistorial);

// ─────────────────────────────────────────
// GET - todos los historiales
// ─────────────────────────────────────────
export const getHistoriales = async (req: Request, res: Response) => {

    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 1000;
        const skip = (page - 1) * limit;

        const [historiales, total] = await historialRepo.findAndCount({
            order: {
                histo_fecha_cambio: "DESC" // más reciente primero
            },
            take: limit,
            skip: skip
        });

        const totalPages = Math.ceil(total / limit);

        res.json({
            ok: true,
            historiales,
            total,
            totalPages,
            page,
            limit
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            message: "Error al obtener historial",
            error
        });

    }

};


// ─────────────────────────────────────────
// GET - historial por ID
// ─────────────────────────────────────────
export const getHistorialById = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const historial = await historialRepo.findOne({
            where: { histo_historial: Number(id) }
        });

        if (!historial) {

            return res.status(404).json({
                ok: false,
                message: "Historial no encontrado"
            });

        }

        res.json({
            ok: true,
            historial
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            message: "Error al obtener historial",
            error
        });

    }

};


// ─────────────────────────────────────────
// GET - historial por árbol  IMPORTANTE
// ─────────────────────────────────────────
export const getHistorialByArbol = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const historiales = await historialRepo.find({
            where: { arb_arbol: Number(id) },
            order: {
                histo_fecha_cambio: "DESC"
            }
        });

        res.json({
            ok: true,
            historiales
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            message: "Error al obtener historial del árbol",
            error
        });

    }

};
