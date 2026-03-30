import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroFincaPerimetro } from "../entities/AgroFincaPerimetro";

export const guardarPerimetro = async (req: Request, res: Response) => {
    // Iniciamos una transacción para borrar lo viejo y guardar lo nuevo de forma segura
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const fincaId = Number(req.params.fincaId);
        const { puntos } = req.body; // Array de { lat, lng } enviado desde React

        if (!puntos || !Array.isArray(puntos)) {
            return res.status(400).json({ message: "Formato de puntos inválido." });
        }

        // 1. Borrar el perímetro anterior de esta finca
        await queryRunner.manager.delete(AgroFincaPerimetro, { fin_finca: fincaId });

        // 2. Insertar los nuevos puntos
        const nuevosPuntos = puntos.map((punto, index) => {
            const nuevo = new AgroFincaPerimetro();
            // perim_perimetro se llenará con el Trigger / Sequence de Oracle al insertar
            nuevo.fin_finca = fincaId;
            nuevo.perim_orden = index + 1;
            nuevo.perim_latitud = punto.lat;
            nuevo.perim_longitud = punto.lng;
            return nuevo;
        });

        await queryRunner.manager.save(nuevosPuntos);

        // Confirmar transacción
        await queryRunner.commitTransaction();
        res.json({ message: "Perímetro guardado exitosamente." });

    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error("Error guardando perímetro:", error);
        res.status(500).json({ message: "Error al guardar el perímetro.", error });
    } finally {
        await queryRunner.release();
    }
};

export const getPerimetro = async (req: Request, res: Response) => {
    try {
        const fincaId = Number(req.params.fincaId);
        const perimetroRepo = AppDataSource.getRepository(AgroFincaPerimetro);

        const perimetro = await perimetroRepo.find({
            where: { fin_finca: fincaId },
            order: { perim_orden: "ASC" }
        });

        res.json(perimetro);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo el perimetro" });
    }
}