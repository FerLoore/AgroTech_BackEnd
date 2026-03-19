import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroUsuario } from "../entities/AgroUsuario";

const agroUsuarioRepo = AppDataSource.getRepository(AgroUsuario);

// ─────────────────────────────────────────────────────────────
// GET /api/agro-usuario
// Lista todos los usuarios ACTIVOS
// ─────────────────────────────────────────────────────────────
export const getAgroUsuarios = async (req: Request, res: Response) => {
    try {
        const usuarios = await agroUsuarioRepo.find({
            where: { usu_activo: 1 },
            order: { usu_usuario: "ASC" }
        });

        res.json({ ok: true, usuarios });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al obtener los usuarios", error });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/agro-usuario/:id
// ─────────────────────────────────────────────────────────────
export const getAgroUsuarioById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const usuario = await agroUsuarioRepo.findOne({
            where: { 
                usu_usuario: Number(id),
                usu_activo: 1 
            }
        });

        if (!usuario) {
            return res.status(404).json({ ok: false, message: `Usuario con ID ${id} no encontrado o inactivo` });
        }

        res.json({ ok: true, usuario });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al obtener el usuario", error });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/agro-usuario
// ─────────────────────────────────────────────────────────────
export const createAgroUsuario = async (req: Request, res: Response) => {
    try {
        const { usu_nombre, rol_rol, usu_especialidad } = req.body;

        // Validamos que envíen lo obligatorio
        if (!usu_nombre || !rol_rol) {
            return res.status(400).json({ 
                ok: false, 
                message: "Los campos usu_nombre y rol_rol son obligatorios" 
            });
        }

        const nuevoUsuario = agroUsuarioRepo.create({
            usu_nombre,
            rol_rol: Number(rol_rol),
            usu_especialidad: usu_especialidad || null,
            usu_activo: 1
        });

        await agroUsuarioRepo.save(nuevoUsuario);

        res.status(201).json({ ok: true, message: "Usuario creado exitosamente", usuario: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al crear el usuario", error });
    }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/agro-usuario/:id
// ─────────────────────────────────────────────────────────────
export const updateAgroUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { usu_nombre, rol_rol, usu_especialidad } = req.body;

        const usuario = await agroUsuarioRepo.findOne({
            where: { usu_usuario: Number(id), usu_activo: 1 }
        });

        if (!usuario) {
            return res.status(404).json({ ok: false, message: `Usuario con ID ${id} no encontrado` });
        }

        // Actualizamos solo los datos que vengan en la petición
        if (usu_nombre !== undefined) usuario.usu_nombre = usu_nombre;
        if (rol_rol !== undefined) usuario.rol_rol = Number(rol_rol);
        if (usu_especialidad !== undefined) usuario.usu_especialidad = usu_especialidad;

        await agroUsuarioRepo.save(usuario);

        res.json({ ok: true, message: "Usuario actualizado exitosamente", usuario });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al actualizar el usuario", error });
    }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/agro-usuario/:id (Borrado Lógico)
// ─────────────────────────────────────────────────────────────
export const deleteAgroUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const usuario = await agroUsuarioRepo.findOne({
            where: { usu_usuario: Number(id), usu_activo: 1 }
        });

        if (!usuario) {
            return res.status(404).json({ ok: false, message: `Usuario con ID ${id} no encontrado` });
        }

        // Desactivamos el usuario
        usuario.usu_activo = 0;
        await agroUsuarioRepo.save(usuario);

        res.json({ ok: true, message: "Usuario desactivado exitosamente" });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al desactivar el usuario", error });
    }
};