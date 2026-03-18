import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroAnalisisLaboratorio } from "../entities/AgroAnalisisLaboratorio";

const analisisRepo = AppDataSource.getRepository(AgroAnalisisLaboratorio);

// GET todos
export const getAnalisis = async (req: Request, res: Response) => {
  try {
    const analisis = await analisisRepo.find();
    res.json(analisis);
  } catch (error) {
    console.error("Error obteniendo análisis:", error);
    res.status(500).json({ message: "Error obteniendo análisis" });
  }
};

// GET por ID
export const getAnalisisById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const analisis = await analisisRepo.findOneBy({
      analab_analisis_laboratorio: Number(id),
    });

    if (!analisis) {
      return res.status(404).json({ message: "Análisis no encontrado" });
    }

    res.json(analisis);
  } catch (error) {
    console.error("Error buscando análisis:", error);
    res.status(500).json({ message: "Error buscando análisis" });
  }
};

// POST
export const createAnalisis = async (req: Request, res: Response) => {
  try {
    const analisis = analisisRepo.create(req.body);
    const result = await analisisRepo.save(analisis);

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creando análisis:", error);
    res.status(500).json({ message: "Error creando análisis" });
  }
};

// PUT
export const updateAnalisis = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const analisis = await analisisRepo.findOneBy({
      analab_analisis_laboratorio: Number(id),
    });

    if (!analisis) {
      return res.status(404).json({ message: "Análisis no encontrado" });
    }

    analisisRepo.merge(analisis, req.body);
    const result = await analisisRepo.save(analisis);

    res.json(result);
  } catch (error) {
    console.error("Error actualizando análisis:", error);
    res.status(500).json({ message: "Error actualizando análisis" });
  }
};

// DELETE
export const deleteAnalisis = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await analisisRepo.delete({
      analab_analisis_laboratorio: Number(id),
    });

    res.json(result);
  } catch (error) {
    console.error("Error eliminando análisis:", error);
    res.status(500).json({ message: "Error eliminando análisis" });
  }
};