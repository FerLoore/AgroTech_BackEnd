import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroMantenimiento } from "../entities/AgroMantenimiento";


const maintenanceRepo = AppDataSource.getRepository(AgroMantenimiento);

export const getMantenimientos = async (req: Request, res: Response) => {
    try {
        const mantenimientos = await maintenanceRepo.find({
            relations: ["seccion", "seccion.finca"],
            order: { man_proxima_fecha: "ASC" }
        });


        res.json({ ok: true, data: mantenimientos });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al obtener mantenimientos", error });
    }
};

export const createMantenimiento = async (req: Request, res: Response) => {
    try {
        const { secc_seccion, man_tipo, man_frecuencia_dias, man_ultima_fecha } = req.body;
        
        const ultimaFecha = new Date(man_ultima_fecha);
        const proximaFecha = new Date(ultimaFecha.getTime() + Number(man_frecuencia_dias) * 24 * 60 * 60 * 1000);

        const nuevo = maintenanceRepo.create({
            secc_seccion: Number(secc_seccion),
            man_tipo,
            man_frecuencia_dias: Number(man_frecuencia_dias),
            man_ultima_fecha: ultimaFecha,
            man_proxima_fecha: proximaFecha
        });


        await maintenanceRepo.save(nuevo);
        res.json({ ok: true, data: nuevo });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al crear mantenimiento", error });
    }
};

export const updateMantenimiento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { man_ultima_fecha } = req.body;

        const mant = await maintenanceRepo.findOneBy({ man_id: Number(id) });
        if (!mant) return res.status(404).json({ ok: false, message: "No encontrado" });

        if (man_ultima_fecha) {
            mant.man_ultima_fecha = new Date(man_ultima_fecha);
            mant.man_proxima_fecha = new Date(mant.man_ultima_fecha.getTime() + mant.man_frecuencia_dias * 24 * 60 * 60 * 1000);
        }


        await maintenanceRepo.save(mant);
        res.json({ ok: true, data: mant });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al actualizar", error });
    }
};

export const deleteMantenimiento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await maintenanceRepo.delete(id);
        res.json({ ok: true, message: "Eliminado" });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al eliminar", error });
    }
};
