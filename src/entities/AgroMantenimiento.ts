import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { AgroSeccion } from "./AgroSeccion";

@Entity("AGRO_MANTENIMIENTO")
export class AgroMantenimiento {
    @PrimaryGeneratedColumn({ name: "MAN_ID" })
    man_id: number;

    @Column({ name: "SECC_SECCION" })
    secc_seccion: number;

    @ManyToOne(() => AgroSeccion)
    @JoinColumn({ name: "SECC_SECCION" })
    seccion: AgroSeccion;

    @Column({ name: "MAN_TIPO", length: 100 })
    man_tipo: string;

    @Column({ name: "MAN_FRECUENCIA_DIAS" })
    man_frecuencia_dias: number;

    @Column({ name: "MAN_ULTIMA_FECHA", type: "timestamp", nullable: true })
    man_ultima_fecha: Date;

    @Column({ name: "MAN_PROXIMA_FECHA", type: "timestamp", nullable: true })
    man_proxima_fecha: Date;
}
