import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroTratamientos } from "../entities/AgroTratamientos";
import { AgroProducto } from "../entities/AgroProducto";
import { AgroAnalisisLaboratorio } from "../entities/AgroAnalisisLaboratorio";
import { AgroAlertaSalud } from "../entities/AgroAlertaSalud";
import { AgroArbol } from "../entities/AgroArbol";
import { AgroHistorial } from "../entities/AgroHistorial";

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

// POST crear (Prescripción)
export const createTratamiento = async (req: Request, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const { 
      trata_tipo, 
      alertsalu_alerta_salud, 
      produ_producto, 
      trata_dosis 
    } = req.body;

    // 1. Validar Diagnóstico si es Curativo
    if (trata_tipo === "Curativo") {
      const analisis = await queryRunner.manager.findOne(AgroAnalisisLaboratorio, {
        where: { alert_alerta_salud: Number(alertsalu_alerta_salud) }
      });

      if (!analisis || analisis.analab_resultado_tipo !== "Positivo") {
        return res.status(400).json({ 
          message: "No se puede prescribir: Se requiere un diagnóstico positivo de laboratorio." 
        });
      }
    }

    // 2. Control de Inventario
    const producto = await queryRunner.manager.findOne(AgroProducto, {
      where: { produ_producto: Number(produ_producto) }
    });

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    // Intentar extraer cantidad numérica de la dosis para el descuento
    // Si no es un número limpio, descontamos 1 unidad por defecto o validamos formato
    const cantidadADescontar = parseFloat(trata_dosis) || 1;

    if (producto.produ_stock_actual < cantidadADescontar) {
      return res.status(400).json({ 
        message: `Stock insuficiente. Disponible: ${producto.produ_stock_actual} ${producto.produ_unidad || ''}` 
      });
    }

    // 3. Descontar Stock
    producto.produ_stock_actual -= cantidadADescontar;
    await queryRunner.manager.save(producto);

    // 4. Crear Tratamiento
    const tratamientoData = {
      ...req.body,
      trata_fecha_inicio: req.body.trata_fecha_inicio ? new Date(req.body.trata_fecha_inicio) : new Date(),
      trata_fecha_fin:    req.body.trata_fecha_fin    ? new Date(req.body.trata_fecha_fin)    : null,
      alertsalu_alerta_salud: req.body.alertsalu_alerta_salud ? Number(req.body.alertsalu_alerta_salud) : null,
      secc_seccion:           req.body.secc_seccion           ? Number(req.body.secc_seccion)           : null,
      produ_producto:         Number(req.body.produ_producto),
    };

    const tratamiento = queryRunner.manager.create(AgroTratamientos, tratamientoData);
    const result = await queryRunner.manager.save(tratamiento);

    await queryRunner.commitTransaction();
    res.status(201).json(result);

  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Error creando tratamiento:", error);
    res.status(500).json({ message: "Error al procesar la prescripción y el descuento de stock" });
  } finally {
    await queryRunner.release();
  }
};

// PUT actualizar (Aplicación y Cierre)
export const updateTratamiento = async (req: Request, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const { id } = req.params;
    const { trata_estado, usu_usuario } = req.body; // usu_usuario para el historial

    const tratamiento = await queryRunner.manager.findOne(AgroTratamientos, {
      where: { trata_tratamientos: Number(id) }
    });

    if (!tratamiento) {
      return res.status(404).json({ message: "Tratamiento no encontrado" });
    }

    const estadoAnterior = tratamiento.trata_estado;
    queryRunner.manager.merge(AgroTratamientos, tratamiento, req.body);
    const result = await queryRunner.manager.save(tratamiento);

    // 5. Si se finaliza, actualizar árbol e historial
    if (trata_estado === "Finalizado" && estadoAnterior !== "Finalizado") {
      // Obtener alerta para llegar al árbol
      const alerta = await queryRunner.manager.findOne(AgroAlertaSalud, {
        where: { alertsalud_id: tratamiento.alertsalu_alerta_salud }
      });

      if (alerta) {
        const arbol = await queryRunner.manager.findOne(AgroArbol, {
          where: { arb_arbol: alerta.arb_arbol }
        });

        if (arbol) {
          const arbEstadoAnterior = arbol.arb_estado;
          arbol.arb_estado = "Sano";
          await queryRunner.manager.save(arbol);

          // Registrar historial
          const historial = queryRunner.manager.create(AgroHistorial, {
            histo_estado_anterior: arbEstadoAnterior,
            histo_estado_nuevo: "Sano",
            histo_fecha_cambio: new Date(),
            arb_arbol: arbol.arb_arbol,
            histo_motivo: `Tratamiento #${tratamiento.trata_tratamientos} finalizado exitosamente`,
            usu_usuario: usu_usuario || 1 // Fallback a admin si no viene
          });
          await queryRunner.manager.save(historial);
        }
      }
    }

    await queryRunner.commitTransaction();
    res.json(result);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error("Error actualizando tratamiento:", error);
    res.status(500).json({ message: "Error al actualizar tratamiento y cerrar ciclo" });
  } finally {
    await queryRunner.release();
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

// GET tratamientos filtrados por árbol específico
export const getTratamientosByArbol = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tratamientos = await tratamientosRepo.createQueryBuilder("tratamiento")
      .innerJoin(AgroAlertaSalud, "alerta", "tratamiento.alertsalu_alerta_salud = alerta.alertsalud_id")
      .where("alerta.arb_arbol = :arbolId", { arbolId: Number(id) })
      .orderBy("tratamiento.trata_fecha_inicio", "DESC")
      .getMany();
      
    res.json(tratamientos);
  } catch (error) {
    console.error("Error buscando tratamientos por árbol:", error);
    res.status(500).json({ message: "Error buscando tratamientos por árbol" });
  }
};