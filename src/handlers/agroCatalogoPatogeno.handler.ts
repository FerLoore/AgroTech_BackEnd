import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroCatalogoPatogeno } from "../entities/AgrocatalogoPatogeno";

const agroCatalogoPatogenoRepo = AppDataSource.getRepository(AgroCatalogoPatogeno);

// ─────────────────────────────────────────────────────────────
// GET /api/agro-catalogo-patogeno
// Lista todos los patógenos activos
// Query params opcionales: ?tipo=Hongo | Bacteria | Plaga
// ─────────────────────────────────────────────────────────────
export const getAgroCatalogoPatogenos = async (req: Request, res: Response) => {
    try {
        const { tipo } = req.query;

        const where: any = { catpato_activo: 1 };

        if (tipo) {
            if (!["Hongo", "Bacteria", "Plaga"].includes(String(tipo))) {
                return res.status(400).json({
                    ok: false,
                    message: "tipo debe ser: Hongo, Bacteria o Plaga"
                });
            }
            where.catpato_tipo = String(tipo);
        }

        const cataloGoPatogenos = await agroCatalogoPatogenoRepo.find({
            where,
            order: { catpato_tipo: "ASC", catpato_gravedad: "DESC" }
        });

        res.json({ ok: true, cataloGoPatogenos });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al obtener catálogo de patógenos", error });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/agro-catalogo-patogeno/:id
// ─────────────────────────────────────────────────────────────
export const getAgroCatalogoPatogenoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const cataloGoPatogeno = await agroCatalogoPatogenoRepo.findOne({
            where: {
                catpato_catalogo_patogeno: Number(id),
                catpato_activo: 1
            }
        });

        if (!cataloGoPatogeno) {
            return res.status(404).json({
                ok: false,
                message: `Patógeno con ID ${id} no encontrado`
            });
        }

        res.json({ ok: true, cataloGoPatogeno });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al obtener el patógeno", error });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/agro-catalogo-patogeno
// Body: { catpato_nombre_comun, catpato_nombre_cientifico, catpato_tipo, catpato_gravedad }
// ─────────────────────────────────────────────────────────────
export const createAgroCatalogoPatogeno = async (req: Request, res: Response) => {
    try {
        const {
            catpato_nombre_comun,
            catpato_nombre_cientifico,
            catpato_tipo,
            catpato_gravedad
        } = req.body;

        // Validar campos requeridos
        if (!catpato_nombre_comun || !catpato_tipo || !catpato_gravedad) {
            return res.status(400).json({
                ok: false,
                message: "Campos requeridos: catpato_nombre_comun, catpato_tipo, catpato_gravedad"
            });
        }

        // Validar tipo
        if (!["Hongo", "Bacteria", "Plaga"].includes(catpato_tipo)) {
            return res.status(400).json({
                ok: false,
                message: "catpato_tipo debe ser: Hongo, Bacteria o Plaga"
            });
        }

        // Validar gravedad
        if (![1, 2, 3].includes(Number(catpato_gravedad))) {
            return res.status(400).json({
                ok: false,
                message: "catpato_gravedad debe ser: 1=Leve, 2=Moderado, 3=Grave"
            });
        }

        // Verificar nombre duplicado
        const existe = await agroCatalogoPatogenoRepo.findOne({
            where: { catpato_nombre_comun }
        });

        if (existe) {
            return res.status(409).json({
                ok: false,
                message: `Ya existe un patógeno con el nombre ${catpato_nombre_comun}`
            });
        }

        const nuevoPatogeno = agroCatalogoPatogenoRepo.create({
            catpato_nombre_comun,
            catpato_nombre_cientifico,
            catpato_tipo,
            catpato_gravedad: Number(catpato_gravedad),
            catpato_activo: 1
        });

        await agroCatalogoPatogenoRepo.save(nuevoPatogeno);

        res.status(201).json({
            ok: true,
            message: "Patógeno creado exitosamente",
            cataloGoPatogeno: nuevoPatogeno
        });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al crear el patógeno", error });
    }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/agro-catalogo-patogeno/:id
// Body: { catpato_nombre_comun, catpato_nombre_cientifico, catpato_tipo, catpato_gravedad }
// ─────────────────────────────────────────────────────────────
export const updateAgroCatalogoPatogeno = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            catpato_nombre_comun,
            catpato_nombre_cientifico,
            catpato_tipo,
            catpato_gravedad
        } = req.body;

        const cataloGoPatogeno = await agroCatalogoPatogenoRepo.findOne({
            where: { catpato_catalogo_patogeno: Number(id) }
        });

        if (!cataloGoPatogeno) {
            return res.status(404).json({
                ok: false,
                message: `Patógeno con ID ${id} no encontrado`
            });
        }

        // Validar tipo si viene
        if (catpato_tipo !== undefined && !["Hongo", "Bacteria", "Plaga"].includes(catpato_tipo)) {
            return res.status(400).json({
                ok: false,
                message: "catpato_tipo debe ser: Hongo, Bacteria o Plaga"
            });
        }

        // Validar gravedad si viene
        if (catpato_gravedad !== undefined && ![1, 2, 3].includes(Number(catpato_gravedad))) {
            return res.status(400).json({
                ok: false,
                message: "catpato_gravedad debe ser: 1=Leve, 2=Moderado, 3=Grave"
            });
        }

        // Actualiza solo los campos que vienen en el body
        if (catpato_nombre_comun      !== undefined) cataloGoPatogeno.catpato_nombre_comun      = catpato_nombre_comun;
        if (catpato_nombre_cientifico !== undefined) cataloGoPatogeno.catpato_nombre_cientifico = catpato_nombre_cientifico;
        if (catpato_tipo              !== undefined) cataloGoPatogeno.catpato_tipo              = catpato_tipo;
        if (catpato_gravedad          !== undefined) cataloGoPatogeno.catpato_gravedad          = Number(catpato_gravedad);

        await agroCatalogoPatogenoRepo.save(cataloGoPatogeno);

        res.json({
            ok: true,
            message: "Patógeno actualizado exitosamente",
            cataloGoPatogeno
        });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al actualizar el patógeno", error });
    }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/agro-catalogo-patogeno/:id  →  Borrado lógico
// ─────────────────────────────────────────────────────────────
export const deleteAgroCatalogoPatogeno = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const cataloGoPatogeno = await agroCatalogoPatogenoRepo.findOne({
            where: { catpato_catalogo_patogeno: Number(id) }
        });

        if (!cataloGoPatogeno) {
            return res.status(404).json({
                ok: false,
                message: `Patógeno con ID ${id} no encontrado`
            });
        }

        // Borrado lógico
        cataloGoPatogeno.catpato_activo = 0;
        await agroCatalogoPatogenoRepo.save(cataloGoPatogeno);

        res.json({ ok: true, message: "Patógeno desactivado exitosamente" });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al desactivar el patógeno", error });
    }
};