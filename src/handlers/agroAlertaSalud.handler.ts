import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroAlertaSalud } from "../entities/AgroAlertaSalud";

const alertaRepo = AppDataSource.getRepository(AgroAlertaSalud);

// GET todas las alertas
export const getAlertas = async (req: Request, res: Response) => {
  try {
    const alertas = await alertaRepo.find();
    res.json(alertas);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo alertas" });
  }
};

// GET alerta por ID
export const getAlertaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const alerta = await alertaRepo.findOneBy({
      alertsalud_id: Number(id)
    });

    if (!alerta) {
      return res.status(404).json({ message: "Alerta no encontrada" });
    }

    res.json(alerta);
  } catch (error) {
    res.status(500).json({ message: "Error buscando alerta" });
  }
};

// POST crear alerta
export const createAlerta = async (req: Request, res: Response) => {
  try {
    const alerta = alertaRepo.create(req.body);
    const result = await alertaRepo.save(alerta);

    res.status(201).json(result);
  } catch (error) {
  console.error("ERROR REAL CREANDO ALERTA:", error);
  res.status(500).json({ message: "Error creando alerta" });
}
};

// PUT actualizar alerta
export const updateAlerta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const alerta = await alertaRepo.findOneBy({
      alertsalud_id: Number(id)
    });

    if (!alerta) {
      return res.status(404).json({ message: "Alerta no encontrada" });
    }

    alertaRepo.merge(alerta, req.body);
    const result = await alertaRepo.save(alerta);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error actualizando alerta" });
  }
};

// DELETE eliminar alerta
export const deleteAlerta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await alertaRepo.delete({
      alertsalud_id: Number(id)
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error eliminando alerta" });
  }
};

// GET alertas filtradas por árbol específico
export const getAlertasByArbol = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const alertas = await alertaRepo.find({
      where: { arb_arbol: Number(id) },
      order: { fecha_deteccion: "DESC" }
    });
    res.json(alertas);
  } catch (error) {
    res.status(500).json({ message: "Error buscando alertas por árbol" });
  }
};