import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroFumigacion } from "../entities/AgroFumigacion";

const repo = AppDataSource.getRepository(AgroFumigacion);

export const getFumigaciones = async (req: Request, res: Response) => {
    try {
        const lista = await repo.find({ order: { fumi_fecha_programada: "ASC" } });
        res.json({ ok: true, fumigaciones: lista });
    } catch (error) {
        res.status(500).json({ ok: false, error });
    }
};

export const createFumigacion = async (req: Request, res: Response) => {
    try {
        const nueva = repo.create({ ...req.body, fumi_estado: "Pendiente" });
        await repo.save(nueva);
        res.status(201).json({ ok: true, fumigacion: nueva });
    } catch (error) {
        res.status(500).json({ ok: false, error });
    }
};

export const marcarRealizada = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const fumi = await repo.findOneBy({ fumi_fumigacion: Number(id) });
        if(fumi) {
            fumi.fumi_estado = "Realizado";
            await repo.save(fumi);
        }
        res.json({ ok: true, message: "Marcada como realizada" });
    } catch (error) {
        res.status(500).json({ ok: false, error });
    }
};