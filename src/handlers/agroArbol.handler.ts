import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroArbol } from "../entities/AgroArbol";

const agroArbolRepo = AppDataSource.getRepository(AgroArbol);


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
// POST - crear árbol
// ─────────────────────────────────────────
export const createAgroArbol = async (req: Request, res: Response) => {

    try {

        const {
            arb_arbol,
            arb_posicion_surco,
            arb_fecha_siembra,
            tipar_tipo_arbol,
            arb_estado,
            sur_surcos
        } = req.body;


        if (
            !arb_arbol ||
            !arb_posicion_surco ||
            !arb_fecha_siembra ||
            !tipar_tipo_arbol ||
            !sur_surcos
        ) {

            return res.status(400).json({
                ok: false,
                message: "Faltan campos obligatorios"
            });

        }


        const nuevoArbol = agroArbolRepo.create({

            arb_arbol: Number(arb_arbol),
            arb_posicion_surco: Number(arb_posicion_surco),
            arb_fecha_siembra,
            tipar_tipo_arbol: Number(tipar_tipo_arbol),
            arb_estado: arb_estado || "Crecimiento",
            sur_surcos: Number(sur_surcos),
            arb_activo: 1

        });


        await agroArbolRepo.save(nuevoArbol);


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
// PUT - actualizar árbol
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
            arb_estado
        } = req.body;


        if (arb_posicion_surco !== undefined)
            arbol.arb_posicion_surco = Number(arb_posicion_surco);

        if (arb_estado !== undefined)
            arbol.arb_estado = arb_estado;


        await agroArbolRepo.save(arbol);


        res.json({
            ok: true,
            message: "Árbol actualizado",
            arbol
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            message: "Error al actualizar el árbol",
            error
        });

    }

};



// ─────────────────────────────────────────
// DELETE - borrado lógico
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

        arbol.arb_activo = 0;

        await agroArbolRepo.save(arbol);

        res.json({
            ok: true,
            message: "Árbol eliminado (borrado lógico)"
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            message: "Error al eliminar el árbol",
            error
        });

    }

};