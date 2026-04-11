import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroAuditoria } from "../entities/AgroAuditoria";
import { Between, Like } from "typeorm";

const repo = AppDataSource.getRepository(AgroAuditoria);

export const getAgroAuditorias = async (req: Request, res: Response) => {
    try {
        const { tabla, accion, usuario, desde, hasta } = req.query;
        const where: any = {};

        if (tabla)   where.audi_tabla          = Like(`%${tabla}%`);
        if (accion)  where.audi_accion         = accion;
        if (usuario) where.audi_usuario_nombre = Like(`%${usuario}%`);
        if (desde && hasta) {
            where.audi_fecha = Between(
                new Date(desde as string),
                new Date(hasta as string)
            );
        }

        const auditorias = await repo.find({
            where,
            order: { audi_fecha: "DESC" },
            take: 200
        });

        res.json({ ok: true, auditorias });

    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al obtener auditoría", error });
    }
};
    export const getAuditoriaById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const auditoria = await repo.findOne({
            where: { audi_auditoria: Number(id) }
        });

        if (!auditoria) {
            return res.status(404).json({
                ok: false,
                message: "Registro no encontrado"
            });
        }

        res.json({
            ok: true,
            auditoria
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error al obtener registro",
            error
        });
    }


};