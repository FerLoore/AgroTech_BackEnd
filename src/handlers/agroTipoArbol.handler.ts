import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroTipoArbol } from "../entities/AgroTipoArbol";

const agroTipoArbolRepo = AppDataSource.getRepository(AgroTipoArbol);

// ─────────────────────────────────────────────────────────────
// GET /api/agro-tipo-arbol
// Lista todos los tipos de árbol
// ─────────────────────────────────────────────────────────────
export const getAgroTipoArboles = async (req: Request, res: Response) => {
    try {
        const tipoArboles = await agroTipoArbolRepo.find({
            order: { tipar_nombre_comun: "ASC" }
        });

        res.json({ ok: true, tipoArboles });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al obtener tipos de árbol", error });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/agro-tipo-arbol/:id
// ─────────────────────────────────────────────────────────────
export const getAgroTipoArbolById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const tipoArbol = await agroTipoArbolRepo.findOne({
            where: { tipar_tipo_arbol: Number(id) }
        });

        if (!tipoArbol) {
            return res.status(404).json({
                ok: false,
                message: `Tipo de árbol con ID ${id} no encontrado`
            });
        }

        res.json({ ok: true, tipoArbol });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al obtener el tipo de árbol", error });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/agro-tipo-arbol
// Body: { tipar_nombre_comun, tipar_nombre_cientifico, tipar_anios_produccion, tipar_descripcion }
// ─────────────────────────────────────────────────────────────
export const createAgroTipoArbol = async (req: Request, res: Response) => {
    try {
        const {
            tipar_nombre_comun,
            tipar_nombre_cientifico,
            tipar_anios_produccion,
            tipar_descripcion
        } = req.body;

        // Validar campo requerido
        if (!tipar_nombre_comun) {
            return res.status(400).json({
                ok: false,
                message: "Campo requerido: tipar_nombre_comun"
            });
        }

        // Validar años de producción si viene
        if (tipar_anios_produccion !== undefined && Number(tipar_anios_produccion) <= 0) {
            return res.status(400).json({
                ok: false,
                message: "tipar_anios_produccion debe ser mayor a 0"
            });
        }

        // Verificar nombre duplicado
        const existe = await agroTipoArbolRepo.findOne({
            where: { tipar_nombre_comun }
        });

        if (existe) {
            return res.status(409).json({
                ok: false,
                message: `Ya existe un tipo de árbol con el nombre ${tipar_nombre_comun}`
            });
        }

        const nuevoTipoArbol = agroTipoArbolRepo.create({
            tipar_nombre_comun,
            tipar_nombre_cientifico,
            tipar_anios_produccion: tipar_anios_produccion ? Number(tipar_anios_produccion) : 8,
            tipar_descripcion
        });

        await agroTipoArbolRepo.save(nuevoTipoArbol);

        res.status(201).json({
            ok: true,
            message: "Tipo de árbol creado exitosamente",
            tipoArbol: nuevoTipoArbol
        });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al crear el tipo de árbol", error });
    }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/agro-tipo-arbol/:id
// Body: { tipar_nombre_comun, tipar_nombre_cientifico, tipar_anios_produccion, tipar_descripcion }
// ─────────────────────────────────────────────────────────────
export const updateAgroTipoArbol = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            tipar_nombre_comun,
            tipar_nombre_cientifico,
            tipar_anios_produccion,
            tipar_descripcion
        } = req.body;

        const tipoArbol = await agroTipoArbolRepo.findOne({
            where: { tipar_tipo_arbol: Number(id) }
        });

        if (!tipoArbol) {
            return res.status(404).json({
                ok: false,
                message: `Tipo de árbol con ID ${id} no encontrado`
            });
        }

        // Validar años de producción si viene
        if (tipar_anios_produccion !== undefined && Number(tipar_anios_produccion) <= 0) {
            return res.status(400).json({
                ok: false,
                message: "tipar_anios_produccion debe ser mayor a 0"
            });
        }

        // Actualiza solo los campos que vienen en el body
        if (tipar_nombre_comun      !== undefined) tipoArbol.tipar_nombre_comun      = tipar_nombre_comun;
        if (tipar_nombre_cientifico !== undefined) tipoArbol.tipar_nombre_cientifico = tipar_nombre_cientifico;
        if (tipar_anios_produccion  !== undefined) tipoArbol.tipar_anios_produccion  = Number(tipar_anios_produccion);
        if (tipar_descripcion       !== undefined) tipoArbol.tipar_descripcion       = tipar_descripcion;

        await agroTipoArbolRepo.save(tipoArbol);

        res.json({
            ok: true,
            message: "Tipo de árbol actualizado exitosamente",
            tipoArbol
        });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al actualizar el tipo de árbol", error });
    }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/agro-tipo-arbol/:id  →  Eliminación física
// AGRO_TIPO_ARBOL no tiene borrado lógico en el diagrama
// ─────────────────────────────────────────────────────────────
export const deleteAgroTipoArbol = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const tipoArbol = await agroTipoArbolRepo.findOne({
            where: { tipar_tipo_arbol: Number(id) }
        });

        if (!tipoArbol) {
            return res.status(404).json({
                ok: false,
                message: `Tipo de árbol con ID ${id} no encontrado`
            });
        }

        await agroTipoArbolRepo.remove(tipoArbol);

        res.json({ ok: true, message: "Tipo de árbol eliminado exitosamente" });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al eliminar el tipo de árbol", error });
    }
};