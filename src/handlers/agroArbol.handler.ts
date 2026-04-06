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

        // Log para ver qué está llegando realmente desde el front
        console.log("Recibiendo árbol:", req.body);

        // Validación más permisiva: permitimos que arb_fecha_siembra pueda ser opcional 
        // si la base de datos tiene un default, o la manejamos aquí.
        if (
            arb_posicion_surco == null ||
            tipar_tipo_arbol == null ||
            sur_surcos == null
        ) {
            return res.status(400).json({
                ok: false,
                message: "Faltan campos obligatorios: posicion, tipo o surco"
            });
        }

        const estadoInicial = arb_estado || "Crecimiento";

        // Si la fecha llega vacía, usamos la fecha actual del servidor
        const fechaFinal = arb_fecha_siembra ? new Date(arb_fecha_siembra) : new Date();

        const nuevoArbol = agroArbolRepo.create({
            arb_posicion_surco: Number(arb_posicion_surco),
            arb_fecha_siembra: fechaFinal,
            tipar_tipo_arbol: Number(tipar_tipo_arbol),
            sur_surcos: Number(sur_surcos),
            arb_estado: estadoInicial,
            arb_activo: 1
        });

        await agroArbolRepo.save(nuevoArbol);

        res.status(201).json({
            ok: true,
            message: "Árbol creado exitosamente",
            arbol: nuevoArbol
        });

    } catch (error: any) {
        console.error("ERROR AL CREAR ÁRBOL:", error);
        res.status(500).json({
            ok: false,
            message: "Error al crear el árbol",
            error: error.message
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

        const {
            arb_posicion_surco,
            arb_fecha_siembra,
            tipar_tipo_arbol,
            arb_estado,
            sur_surcos
        } = req.body;

        // ───── CAMPOS NORMALES ─────
        if (arb_posicion_surco !== undefined) {
            arbol.arb_posicion_surco = Number(arb_posicion_surco);
        }

        if (arb_fecha_siembra !== undefined) {
            arbol.arb_fecha_siembra = arb_fecha_siembra;
        }

        if (tipar_tipo_arbol !== undefined) {
            arbol.tipar_tipo_arbol = Number(tipar_tipo_arbol);
        }

        if (sur_surcos !== undefined) {
            arbol.sur_surcos = Number(sur_surcos);
        }

        // ───── ESTADO ─────

        const estadoNuevo = arb_estado || arbol.arb_estado;
        if (estadoNuevo && estadoNuevo !== arbol.arb_estado) {


            arbol.arb_estado = estadoNuevo;
        }

        // GUARDAR SIEMPRE
        await agroArbolRepo.save(arbol);

        res.json({
            ok: true,
            message: "Árbol actualizado correctamente"
        });

    } catch (error: any) {
        console.error("ERROR REAL:", error);

        res.status(500).json({
            ok: false,
            message: "Error al actualizar",
            error: error.message
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