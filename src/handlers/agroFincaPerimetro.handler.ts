import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroFincaPerimetro } from "../entities/AgroFincaPerimetro";

// ─────────────────────────────────────────────────────────────
// GET /agro-finca-perimetro/:fincaId
// ─────────────────────────────────────────────────────────────
export const getPerimetro = async (req: Request, res: Response) => {
    try {
        const fincaId = Number(req.params.fincaId);
        const perimetroRepo = AppDataSource.getRepository(AgroFincaPerimetro);

        const perimetro = await perimetroRepo.find({
            where: { fin_finca: fincaId },
            order: { perim_orden: "ASC" }
        });

        res.json({ ok: true, perimetro });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Error obteniendo el perímetro", error });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /agro-finca-perimetro/:fincaId
// Body esperado: { puntos: [{ lat, lng }] }   ← viene de leaflet-draw
// ✅ Transacción: borra anterior y guarda nuevo de forma atómica
// ─────────────────────────────────────────────────────────────
export const guardarPerimetro = async (req: Request, res: Response) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const fincaId = Number(req.params.fincaId);
        const { puntos } = req.body;

        if (!puntos || !Array.isArray(puntos) || puntos.length < 3) {
            return res.status(400).json({
                ok: false,
                message: "Se necesitan al menos 3 puntos para definir un perímetro."
            });
        }

        // Borra perímetro anterior
        await queryRunner.manager.delete(AgroFincaPerimetro, { fin_finca: fincaId });

        // Inserta nuevos puntos
        // ✅ El trigger TRG_AGRO_FINCA_PERIMETRO asigna PERIM_PERIMETRO automáticamente
        // NO asignar perim_perimetro manualmente — el trigger lo hace
        const nuevosPuntos = puntos.map((punto: { lat: number; lng: number }, index: number) => {
            const p = new AgroFincaPerimetro();
            p.fin_finca = fincaId;
            p.perim_orden = index + 1;
            p.perim_latitud = Number(punto.lat);
            p.perim_longitud = Number(punto.lng);
            return p;
        });

        await queryRunner.manager.save(AgroFincaPerimetro, nuevosPuntos);
        await queryRunner.commitTransaction();

        res.json({ ok: true, message: "Perímetro guardado exitosamente.", total: nuevosPuntos.length });

    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error("Error guardando perímetro:", error);
        res.status(500).json({ ok: false, message: "Error al guardar el perímetro.", error });
    } finally {
        await queryRunner.release();
    }
};

// ─────────────────────────────────────────────────────────────
// DELETE /agro-finca-perimetro/:fincaId
// Borra todos los puntos del perímetro de una finca
// ─────────────────────────────────────────────────────────────
export const deletePerimetro = async (req: Request, res: Response) => {
    try {
        const fincaId = Number(req.params.fincaId);
        const perimetroRepo = AppDataSource.getRepository(AgroFincaPerimetro);
        await perimetroRepo.delete({ fin_finca: fincaId });
        res.json({ ok: true, message: "Perímetro eliminado." });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Error eliminando el perímetro.", error });
    }
};