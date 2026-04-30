import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { AgroSeccion } from "./AgroSeccion";

@Entity({ name: "AGRO_MANTENIMIENTO_SECC" })
export class AgroMantenimientoSeccion {
  @PrimaryColumn({ name: "MAN_ID" })
  man_id: number;

  @Column({ name: "SECC_SECCION" })
  secc_seccion: number;

  @Column({ name: "MAN_TIPO", length: 100 })
  man_tipo: string;

  @Column({ name: "MAN_FRECUENCIA_DIAS", type: "number" })
  man_frecuencia_dias: number;

  @Column({ name: "MAN_ULTIMA_FECHA", type: "date", nullable: true })
  man_ultima_fecha: Date;

  @Column({ name: "MAN_PROXIMA_FECHA", type: "date", nullable: true })
  man_proxima_fecha: Date;

  @ManyToOne(() => AgroSeccion)
  @JoinColumn({ name: "SECC_SECCION" })
  seccion: AgroSeccion;
}
