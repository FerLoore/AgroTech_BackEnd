import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { AgroTratamientos } from "../entities/AgroTratamientos";
import { AgroProducto } from "../entities/AgroProducto";
import { AgroHistorial } from "../entities/AgroHistorial";
import { AgroAlertaSalud } from "../entities/AgroAlertaSalud";

const repo = AppDataSource.getRepository(AgroTratamientos);

// ==========================================
// RUTAS CRUD BÁSICAS
// ==========================================

// GET todos
export const getTratamientos = async (req: Request, res: Response) => {
    try {
        const tratamientos = await repo.find();
        res.json({ ok: true, tratamientos });
    } catch (error) {
        res.status(500).json({ ok: false, error });
    }
};

// GET por ID
export const getTratamientoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tratamiento = await repo.findOne({ 
            where: { trata_tratamientos: Number(id) } 
        });

        if (!tratamiento) throw new Error("Tratamiento no encontrado");
        
        res.json({ ok: true, tratamiento });
    } catch (error: any) {
        res.status(404).json({ ok: false, message: error.message });
    }
};

// PUT actualizar (Edición básica)
export const updateTratamiento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tratamiento = await repo.findOne({ 
            where: { trata_tratamientos: Number(id) } 
        });

        if (!tratamiento) throw new Error("Tratamiento no encontrado");

        // Actualizamos los datos (merge une el objeto viejo con los datos nuevos)
        repo.merge(tratamiento, req.body);
        const resultado = await repo.save(tratamiento);

        res.json({ ok: true, message: "Tratamiento actualizado", resultado });
    } catch (error: any) {
        res.status(400).json({ ok: false, message: error.message });
    }
};

// DELETE eliminar
export const deleteTratamiento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const resultado = await repo.delete(Number(id));

        if (resultado.affected === 0) {
            throw new Error("Tratamiento no encontrado");
        }

        res.json({ ok: true, message: "Tratamiento eliminado correctamente" });
    } catch (error: any) {
        res.status(400).json({ ok: false, message: error.message });
    }
};

// ==========================================
// RUTAS DE LÓGICA DE NEGOCIO
// ==========================================

// 1. PRESCRIBIR (Crea y descuenta stock)
export const createTratamiento = async (req: Request, res: Response) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const { produ_producto, trata_cantidad, ...data } = req.body;

        // Verificar stock
        const producto = await queryRunner.manager.findOne(AgroProducto, { 
            where: { produ_producto: Number(produ_producto) } 
        });

        if (!producto || producto.produ_stock < Number(trata_cantidad)) {
            throw new Error("Stock insuficiente para este producto.");
        }

        // Descontar stock
        producto.produ_stock -= Number(trata_cantidad);
        await queryRunner.manager.save(producto);

        // Crear Tratamiento con nombres exactos de la entidad
        const nuevo = queryRunner.manager.create(AgroTratamientos, {
            ...data,
            produ_producto: Number(produ_producto),
            trata_estado: "En curso",
            trata_fecha_inicio: new Date()
        });
        await queryRunner.manager.save(nuevo);

        await queryRunner.commitTransaction();
        res.status(201).json({ ok: true, message: "Tratamiento creado y stock descontado" });
    } catch (error: any) {
        await queryRunner.rollbackTransaction();
        res.status(400).json({ ok: false, message: error.message });
    } finally {
        await queryRunner.release();
    }
};

// 2. SEGUIMIENTO (Finaliza y crea historial)
export const finalizarTratamiento = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { usu_usuario } = req.body; 
    
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const tratamiento = await queryRunner.manager.findOne(AgroTratamientos, { 
            where: { trata_tratamientos: Number(id) } 
        });

        if (!tratamiento) throw new Error("Tratamiento no encontrado");

        // Cambiar estado
        tratamiento.trata_estado = "Finalizado";
        tratamiento.trata_fecha_fin = new Date();
        await queryRunner.manager.save(tratamiento);

        // Obtain the associated tree ID through the Health Alert
        const alerta = await queryRunner.manager.findOne(AgroAlertaSalud, {
            where: { alertsalud_id: tratamiento.alertsalu_alerta_salud }
        });

        if (!alerta) throw new Error("Alerta de salud no encontrada para este tratamiento.");

        // Crear Historial del árbol
        const nuevoHistorial = queryRunner.manager.create(AgroHistorial, {
            arb_arbol: alerta.arb_arbol, 
            histo_fecha_cambio: new Date(),
            histo_motivo: `Tratamiento ID ${id} finalizado. Dosis: ${tratamiento.trata_dosis || 'N/A'}`,
            histo_estado_anterior: "En tratamiento",
            histo_estado_nuevo: "Sano",
            usu_usuario: usu_usuario || 1 
        });
        await queryRunner.manager.save(nuevoHistorial);

        await queryRunner.commitTransaction();
        res.json({ ok: true, message: "Tratamiento finalizado e historial guardado." });
    } catch (error: any) {
        await queryRunner.rollbackTransaction();
        res.status(400).json({ ok: false, message: error.message });
    } finally {
        await queryRunner.release();
    }
};