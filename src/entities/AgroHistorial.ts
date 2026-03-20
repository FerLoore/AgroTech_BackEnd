import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("AGRO_HISTORIAL")
export class AgroHistorial {

    @PrimaryGeneratedColumn({ name: "HISTO_HISTORIAL" })
    histo_historial: number;

    @Column({ name: "HISTO_ESTADO_ANTERIOR", type: "varchar2", length: 20, nullable: true })
    histo_estado_anterior: string;

    @Column({ name: "HISTO_ESTADO_NUEVO", type: "varchar2", length: 20 })
    histo_estado_nuevo: string;

    @Column({ name: "HISTO_FECHA_CAMBIO", type: "timestamp" })
    histo_fecha_cambio: Date;

    @Column({ name: "ARB_ARBOL", type: "number" })
    arb_arbol: number;

    @Column({ name: "HISTO_MOTIVO", type: "varchar2", length: 300, nullable: true })
    histo_motivo: string;

    @Column({ name: "USU_USUARIO", type: "number" })
    usu_usuario: number;
}