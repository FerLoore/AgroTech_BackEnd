import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroRol } from "../entities/AgroRol";

const agroRolRepo = AppDataSource.getRepository(AgroRol);

// ─────────────────────────────────────────────────────────────
// GET /api/agro-roles
// ─────────────────────────────────────────────────────────────
export const getAgroRoles = async (req: Request, res: Response) => {
    try {
        const roles = await agroRolRepo.find({
            where: { rol_activo: 1 },
            order: { rol_permiso: "DESC" }
        });

        res.json({ ok: true, roles });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al obtener roles", error });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/agro-roles/:id
// ─────────────────────────────────────────────────────────────
export const getAgroRolById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const rol = await agroRolRepo.findOne({
            where: { rol_rol: Number(id), rol_activo: 1 }
        });

        if (!rol) {
            return res.status(404).json({
                ok: false,
                message: `Rol con ID ${id} no encontrado`
            });
        }

        res.json({ ok: true, rol });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al obtener el rol", error });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/agro-roles
// Body: { rol_rol, rol_nombre, rol_descripcion, rol_permiso }
// ─────────────────────────────────────────────────────────────
export const createAgroRol = async (req: Request, res: Response) => {
    try {
        const { rol_rol, rol_nombre, rol_descripcion, rol_permiso } = req.body;

        // Validar campos requeridos
        if (!rol_rol || !rol_nombre || !rol_permiso) {
            return res.status(400).json({
                ok: false,
                message: "Campos requeridos: rol_rol, rol_nombre, rol_permiso"
            });
        }

        // Validar rango de permiso
        if (![1, 2, 3, 4].includes(Number(rol_permiso))) {
            return res.status(400).json({
                ok: false,
                message: "rol_permiso debe ser: 1=Operario, 2=Supervisor, 3=Agronomo, 4=Admin"
            });
        }

        // Verificar ID duplicado
        const existe = await agroRolRepo.findOne({
            where: { rol_rol: Number(rol_rol) }
        });

        if (existe) {
            return res.status(409).json({
                ok: false,
                message: `Ya existe un rol con ID ${rol_rol}`
            });
        }

        const nuevoRol = agroRolRepo.create({
            rol_rol:        Number(rol_rol),
            rol_nombre,
            rol_descripcion,
            rol_permiso:    Number(rol_permiso),
            rol_activo:     1
        });

        await agroRolRepo.save(nuevoRol);

        res.status(201).json({
            ok: true,
            message: "Rol creado exitosamente",
            rol: nuevoRol
        });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al crear el rol", error });
    }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/agro-roles/:id
// Body: { rol_nombre, rol_descripcion, rol_permiso }
// ─────────────────────────────────────────────────────────────
export const updateAgroRol = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { rol_nombre, rol_descripcion, rol_permiso } = req.body;

        const rol = await agroRolRepo.findOne({
            where: { rol_rol: Number(id) }
        });

        if (!rol) {
            return res.status(404).json({
                ok: false,
                message: `Rol con ID ${id} no encontrado`
            });
        }

        // Validar permiso si viene en el body
        if (rol_permiso !== undefined && ![1, 2, 3, 4].includes(Number(rol_permiso))) {
            return res.status(400).json({
                ok: false,
                message: "rol_permiso debe ser: 1=Operario, 2=Supervisor, 3=Agronomo, 4=Admin"
            });
        }

        // Actualiza solo los campos que vienen en el body
        if (rol_nombre      !== undefined) rol.rol_nombre      = rol_nombre;
        if (rol_descripcion !== undefined) rol.rol_descripcion = rol_descripcion;
        if (rol_permiso     !== undefined) rol.rol_permiso     = Number(rol_permiso);

        await agroRolRepo.save(rol);

        res.json({
            ok: true,
            message: "Rol actualizado exitosamente",
            rol
        });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al actualizar el rol", error });
    }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/agro-roles/:id  →  Borrado lógico
// ─────────────────────────────────────────────────────────────
export const deleteAgroRol = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const rol = await agroRolRepo.findOne({
            where: { rol_rol: Number(id) }
        });

        if (!rol) {
            return res.status(404).json({
                ok: false,
                message: `Rol con ID ${id} no encontrado`
            });
        }

        rol.rol_activo = 0;
        await agroRolRepo.save(rol);

        res.json({ ok: true, message: "Rol desactivado exitosamente" });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al desactivar el rol", error });
    }
};