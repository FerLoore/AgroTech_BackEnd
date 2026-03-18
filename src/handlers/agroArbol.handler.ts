import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroArbol } from "../entities/AgroArbol";
import { AgroHistorial } from "../entities/AgroHistorial";

const agroArbolRepo = AppDataSource.getRepository(AgroArbol);
const historialRepo = AppDataSource.getRepository(AgroHistorial);

//  función reutilizable
const guardarHistorial = async (data: any) => {
    const historial = historialRepo.create(data);
    await historialRepo.save(historial);
};

// ─────────────────────────────────────────
// GET - listar árboles
// ─────────────────────────────────────────
export const getAgroArboles = async (req: Request, res: Response) => {
    try {

        const arboles = await agroArbolRepo.find({
            where: { arb_activo: 1 }
        });

        res.json({
            ok: true,
            arboles
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

        if (
            arb_posicion_surco == null ||
            arb_fecha_siembra == null ||
            tipar_tipo_arbol == null ||
            sur_surcos == null
        ) {
            return res.status(400).json({
                ok: false,
                message: "Faltan campos obligatorios"
            });
        }

        const nuevoArbol = agroArbolRepo.create({
            arb_posicion_surco: Number(arb_posicion_surco),
            arb_fecha_siembra,
            tipar_tipo_arbol: Number(tipar_tipo_arbol),
            sur_surcos: Number(sur_surcos),
            arb_activo: 1
        });

        await agroArbolRepo.save(nuevoArbol);

        const estadoInicial = arb_estado || "Crecimiento";

        await guardarHistorial({
            histo_estado_anterior: null,
            histo_estado_nuevo: estadoInicial,
            arb_arbol: nuevoArbol.arb_arbol,
            histo_motivo: "Creación del árbol",
            usu_usuario: 1
        });

        res.status(201).json({
            ok: true,
            message: "Árbol creado exitosamente",
            arbol: nuevoArbol
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error al crear el árbol",
            error
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

        const { arb_posicion_surco, arb_estado } = req.body;

        // SOLO campos normales (NO estado)
        if (arb_posicion_surco !== undefined) {
            arbol.arb_posicion_surco = Number(arb_posicion_surco);
            await agroArbolRepo.save(arbol);
        }

        // CAMBIO DE ESTADO SOLO POR HISTORIAL
        if (arb_estado && arb_estado !== arbol.arb_estado) {
            await guardarHistorial({
                histo_estado_anterior: arbol.arb_estado,
                histo_estado_nuevo: arb_estado,
                arb_arbol: arbol.arb_arbol,
                histo_motivo: "Cambio de estado",
                usu_usuario: 1
            });
        }

        res.json({
            ok: true,
            message: "Árbol actualizado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error al actualizar",
            error
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

        // estado válido (IMPORTANTE)
        await guardarHistorial({
            histo_estado_anterior: arbol.arb_estado,
            histo_estado_nuevo: "Muerto",
            arb_arbol: arbol.arb_arbol,
            histo_motivo: "Eliminación lógica",
            usu_usuario: 1
        });

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