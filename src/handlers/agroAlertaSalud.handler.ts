import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroAlertaSalud } from "../entities/AgroAlertaSalud";

const alertaRepo = AppDataSource.getRepository(AgroAlertaSalud);

// GET todas las alertas ACTIVAS
export const getAlertas = async (req: Request, res: Response) => {
  try {
    const alertas = await alertaRepo.find({
      where: { alertsalud_activo: 1 },
      relations: [
        "arbol", 
        "arbol.surco", 
        "arbol.surco.seccion", 
        "arbol.surco.seccion.finca"
      ]
    });
    res.json(alertas);

  } catch (error) {
    res.status(500).json({ message: "Error obteniendo alertas" });
  }
};

// GET alerta por ID (solo si está activa)
export const getAlertaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const alerta = await alertaRepo.findOneBy({
      alertsalud_id: Number(id),
      alertsalud_activo: 1
    });

    if (!alerta) {
      return res.status(404).json({ message: "Alerta no encontrada o inactiva" });
    }

    res.json(alerta);
  } catch (error) {
    res.status(500).json({ message: "Error buscando alerta" });
  }
};

// POST crear alerta
export const createAlerta = async (req: Request, res: Response) => {
  try {
    const alertaData = { ...req.body, alertsalud_activo: 1 };
    const alerta = alertaRepo.create(alertaData);
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
      alertsalud_id: Number(id),
      alertsalud_activo: 1
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

// DELETE eliminar alerta (BORRADO LÓGICO)
export const deleteAlerta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const alertId = Number(id);

    const alerta = await alertaRepo.findOneBy({ alertsalud_id: alertId });

    if (!alerta) {
      return res.status(404).json({ message: "Alerta no encontrada" });
    }

    // En lugar de delete físico, hacemos update de activo -> 0
    alerta.alertsalud_activo = 0;
    await alertaRepo.save(alerta);

    res.json({ ok: true, message: "Alerta desactivada correctamente" });
  } catch (error) {
    console.error("ERROR DESACTIVANDO ALERTA:", error);
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