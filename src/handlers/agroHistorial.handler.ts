import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroHistorial } from "../entities/AgroHistorial";

const historialRepo = AppDataSource.getRepository(AgroHistorial);


// GET todos los historiales
export const getHistoriales = async (req: Request, res: Response) => {

    try {

        const historiales = await historialRepo.find();

        res.json({
            ok: true,
            historiales
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            message: "Error al obtener historial",
            error
        });

    }

};


// GET historial por ID
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


// POST crear historial
export const createHistorial = async (req: Request, res: Response) => {

    try {

        const {
            histo_historial,
            histo_estado_anterior,
            histo_estado_nuevo,
            arb_arbol,
            histo_motivo,
            usu_usuario
        } = req.body;


        if (!histo_historial || !histo_estado_nuevo || !arb_arbol || !usu_usuario) {

            return res.status(400).json({
                ok: false,
                message: "Faltan campos obligatorios"
            });

        }


        const nuevoHistorial = historialRepo.create({

            histo_historial: Number(histo_historial),
            histo_estado_anterior,
            histo_estado_nuevo,
            arb_arbol: Number(arb_arbol),
            histo_motivo,
            usu_usuario: Number(usu_usuario)

        });


        await historialRepo.save(nuevoHistorial);


        res.status(201).json({

            ok: true,
            message: "Historial creado correctamente",
            historial: nuevoHistorial

        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            message: "Error al crear historial",
            error
        });

    }

};


// PUT actualizar historial
export const updateHistorial = async (req: Request, res: Response) => {

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

        const {
            histo_estado_nuevo,
            histo_motivo
        } = req.body;

        if (histo_estado_nuevo !== undefined)
            historial.histo_estado_nuevo = histo_estado_nuevo;

        if (histo_motivo !== undefined)
            historial.histo_motivo = histo_motivo;

        await historialRepo.save(historial);

        res.json({
            ok: true,
            message: "Historial actualizado",
            historial
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            message: "Error al actualizar historial",
            error
        });

    }

};


// DELETE historial
export const deleteHistorial = async (req: Request, res: Response) => {

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

        await historialRepo.remove(historial);

        res.json({
            ok: true,
            message: "Historial eliminado"
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            message: "Error al eliminar historial",
            error
        });

    }

};