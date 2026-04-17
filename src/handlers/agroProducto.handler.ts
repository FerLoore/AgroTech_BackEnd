import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroProducto } from "../entities/AgroProducto";

const agroProductoRepo = AppDataSource.getRepository(AgroProducto);

// ─────────────────────────────────────────────────────────────
// GET /api/agro-producto
// Lista todos los productos activos
// Query param opcional: ?tipo=Fungicida | Bactericida | Insecticida
// ─────────────────────────────────────────────────────────────
export const getAgroProductos = async (req: Request, res: Response) => {
    try {
        const { tipo } = req.query;

        const where: any = { produ_activo: 1 };
        if (tipo) where.produ_tipo = String(tipo);

        const productos = await agroProductoRepo.find({
            where,
            order: { produ_nombre: "ASC" }
        });

        res.json({ ok: true, productos });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al obtener productos", error });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/agro-producto/:id
// ─────────────────────────────────────────────────────────────
export const getAgroProductoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const producto = await agroProductoRepo.findOne({
            where: {
                produ_producto: Number(id),
                produ_activo: 1
            }
        });

        if (!producto) {
            return res.status(404).json({
                ok: false,
                message: `Producto con ID ${id} no encontrado`
            });
        }

        res.json({ ok: true, producto });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al obtener el producto", error });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/agro-producto
// Body: { produ_nombre, produ_tipo, produ_concentracion, produ_unidad }
// ─────────────────────────────────────────────────────────────
export const createAgroProducto = async (req: Request, res: Response) => {
    try {
        const {
            produ_nombre,
            produ_tipo,
            produ_concentracion,
            produ_unidad,
            produ_stock_actual,
            produ_stock_minimo
        } = req.body;

        // Validar campos requeridos
        if (!produ_nombre || !produ_tipo) {
            return res.status(400).json({
                ok: false,
                message: "Campos requeridos: produ_nombre, produ_tipo"
            });
        }

        // Verificar nombre duplicado
        const existe = await agroProductoRepo.findOne({
            where: { produ_nombre }
        });

        if (existe) {
            return res.status(409).json({
                ok: false,
                message: `Ya existe un producto con el nombre ${produ_nombre}`
            });
        }

        const nuevoProducto = agroProductoRepo.create({
            produ_nombre,
            produ_tipo,
            produ_concentracion,
            produ_unidad,
            produ_stock_actual: produ_stock_actual ?? 0,
            produ_stock_minimo: produ_stock_minimo ?? 0,
            produ_activo: 1
        });

        await agroProductoRepo.save(nuevoProducto);

        res.status(201).json({
            ok: true,
            message: "Producto creado exitosamente",
            producto: nuevoProducto
        });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al crear el producto", error });
    }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/agro-producto/:id
// Body: { produ_nombre, produ_tipo, produ_concentracion, produ_unidad }
// ─────────────────────────────────────────────────────────────
export const updateAgroProducto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            produ_nombre,
            produ_tipo,
            produ_concentracion,
            produ_unidad,
            produ_stock_actual,
            produ_stock_minimo
        } = req.body;

        const producto = await agroProductoRepo.findOne({
            where: { produ_producto: Number(id) }
        });

        if (!producto) {
            return res.status(404).json({
                ok: false,
                message: `Producto con ID ${id} no encontrado`
            });
        }

        // Actualiza solo los campos que vienen en el body
        if (produ_nombre        !== undefined) producto.produ_nombre        = produ_nombre;
        if (produ_tipo          !== undefined) producto.produ_tipo          = produ_tipo;
        if (produ_concentracion !== undefined) producto.produ_concentracion = produ_concentracion;
        if (produ_unidad        !== undefined) producto.produ_unidad        = produ_unidad;
        if (produ_stock_actual  !== undefined) producto.produ_stock_actual  = Number(produ_stock_actual);
        if (produ_stock_minimo  !== undefined) producto.produ_stock_minimo  = Number(produ_stock_minimo);

        await agroProductoRepo.save(producto);

        res.json({
            ok: true,
            message: "Producto actualizado exitosamente",
            producto
        });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al actualizar el producto", error });
    }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/agro-producto/:id  →  Borrado lógico
// ─────────────────────────────────────────────────────────────
export const deleteAgroProducto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const producto = await agroProductoRepo.findOne({
            where: { produ_producto: Number(id) }
        });

        if (!producto) {
            return res.status(404).json({
                ok: false,
                message: `Producto con ID ${id} no encontrado`
            });
        }

        // Borrado lógico
        producto.produ_activo = 0;
        await agroProductoRepo.save(producto);

        res.json({ ok: true, message: "Producto desactivado exitosamente" });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al desactivar el producto", error });
    }
};