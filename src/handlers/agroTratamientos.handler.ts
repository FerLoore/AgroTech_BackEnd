import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroTratamientos } from "../entities/AgroTratamientos";

const tratamientosRepo = AppDataSource.getRepository(AgroTratamientos);

// GET todos
export const getTratamientos = async (req: Request, res: Response) => {
  try {
    const tratamientos = await tratamientosRepo.find();
    res.json(tratamientos);
  } catch (error) {
    console.error("Error obteniendo tratamientos:", error);
    res.status(500).json({ message: "Error obteniendo tratamientos" });
  }
};

// GET por ID
export const getTratamientoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tratamiento = await tratamientosRepo.findOneBy({
      trata_tratamientos: Number(id),
    });

    if (!tratamiento) {
      return res.status(404).json({ message: "Tratamiento no encontrado" });
    }

    res.json(tratamiento);
  } catch (error) {
    console.error("Error buscando tratamiento:", error);
    res.status(500).json({ message: "Error buscando tratamiento" });
  }
};

// POST crear
export const createTratamiento = async (req: Request, res: Response) => {
  try {
    const tratamiento = tratamientosRepo.create(req.body);
    const result = await tratamientosRepo.save(tratamiento);

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creando tratamiento:", error);
    res.status(500).json({ message: "Error creando tratamiento" });
  }
};

// PUT actualizar
export const updateTratamiento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tratamiento = await tratamientosRepo.findOneBy({
      trata_tratamientos: Number(id),
    });

    if (!tratamiento) {
      return res.status(404).json({ message: "Tratamiento no encontrado" });
    }

    tratamientosRepo.merge(tratamiento, req.body);
    const result = await tratamientosRepo.save(tratamiento);

    res.json(result);
  } catch (error) {
    console.error("Error actualizando tratamiento:", error);
    res.status(500).json({ message: "Error actualizando tratamiento" });
  }
};

// DELETE eliminar
export const deleteTratamiento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await tratamientosRepo.delete({
      trata_tratamientos: Number(id),
    });

    res.json(result);
  } catch (error) {
    console.error("Error eliminando tratamiento:", error);
    res.status(500).json({ message: "Error eliminando tratamiento" });
  }
};