import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroMantenimientoSeccion } from "../entities/AgroMantenimientoSeccion";

const mantenimientoRepo = AppDataSource.getRepository(AgroMantenimientoSeccion);

// GET todos
export const getMantenimientos = async (req: Request, res: Response) => {
  try {
    const mantenimientos = await mantenimientoRepo.find({
      relations: ["seccion"]
    });
    res.json(mantenimientos);
  } catch (error) {
    console.error("Error obteniendo mantenimientos:", error);
    res.status(500).json({ message: "Error obteniendo mantenimientos" });
  }
};

// POST crear
export const createMantenimiento = async (req: Request, res: Response) => {
  try {
    const { secc_seccion, man_tipo, man_frecuencia_dias, man_ultima_fecha } = req.body;
    
    // Calcular proxima fecha
    let proximaFecha = null;
    if (man_ultima_fecha && man_frecuencia_dias) {
      const ultima = new Date(man_ultima_fecha);
      proximaFecha = new Date(ultima.getTime() + man_frecuencia_dias * 24 * 60 * 60 * 1000);
    }

    // Obtener ID desde la secuencia
    const sequenceResult = await AppDataSource.query("SELECT SEQ_MANTENIMIENTO_SECC.NEXTVAL as NEXTVAL FROM DUAL");
    const man_id = sequenceResult[0].NEXTVAL;

    const nuevoMantenimiento = mantenimientoRepo.create({
      man_id,
      secc_seccion: Number(secc_seccion),
      man_tipo,
      man_frecuencia_dias: Number(man_frecuencia_dias),
      man_ultima_fecha: man_ultima_fecha ? new Date(man_ultima_fecha) : null,
      man_proxima_fecha: proximaFecha
    });

    const result = await mantenimientoRepo.save(nuevoMantenimiento);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creando mantenimiento:", error);
    res.status(500).json({ message: "Error creando mantenimiento" });
  }
};

// PUT actualizar (marcar como completado hoy y recalcular próxima fecha)
export const updateMantenimiento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { man_ultima_fecha } = req.body;

    const mantenimiento = await mantenimientoRepo.findOneBy({ man_id: Number(id) });
    if (!mantenimiento) {
      return res.status(404).json({ message: "Mantenimiento no encontrado" });
    }

    if (man_ultima_fecha) {
      mantenimiento.man_ultima_fecha = new Date(man_ultima_fecha);
      mantenimiento.man_proxima_fecha = new Date(mantenimiento.man_ultima_fecha.getTime() + mantenimiento.man_frecuencia_dias * 24 * 60 * 60 * 1000);
    }

    const result = await mantenimientoRepo.save(mantenimiento);
    res.json(result);
  } catch (error) {
    console.error("Error actualizando mantenimiento:", error);
    res.status(500).json({ message: "Error actualizando mantenimiento" });
  }
};

// DELETE eliminar
export const deleteMantenimiento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await mantenimientoRepo.delete({ man_id: Number(id) });
    res.json(result);
  } catch (error) {
    console.error("Error eliminando mantenimiento:", error);
    res.status(500).json({ message: "Error eliminando mantenimiento" });
  }
};
