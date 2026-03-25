import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroAuditoria } from "../entities/AgroAuditoria";
import { Between, Like } from "typeorm";

const repo = AppDataSource.getRepository(AgroAuditoria);

export const getAgroAuditorias = async (req: Request, res: Response) => {
    try {
        const { tabla, accion, usuario, desde, hasta } = req.query;
        const where: any = {};

        if (tabla)   where.aud_tabla   = Like(`%${tabla}%`);
        if (accion)  where.aud_accion  = accion;
        if (usuario) where.aud_usuario = Like(`%${usuario}%`);
        if (desde && hasta) {
            where.aud_fecha = Between(new Date(desde as string), new Date(hasta as string));
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