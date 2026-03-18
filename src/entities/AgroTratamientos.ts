import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "AGRO_TRATAMIENTOS" })
export class AgroTratamientos {

  @PrimaryColumn({ name: "TRATA_TRATAMIENTOS" })
  trata_tratamientos: number;

  @Column({ name: "TRATA_FECHA_INICIO", type: "date" })
  trata_fecha_inicio: Date;

  @Column({ name: "TRATA_FECHA_FIN", type: "date", nullable: true })
  trata_fecha_fin: Date;

  @Column({ name: "TRATA_ESTADO" })
  trata_estado: string;

  @Column({ name: "TRATA_DOSIS", nullable: true })
  trata_dosis: string;

  @Column({ name: "TRATA_OBSERVACIONES", nullable: true })
  trata_observaciones: string;

  @Column({ name: "ALERTSALU_ALERTA_SALUD" })
  alertsalu_alerta_salud: number;

  @Column({ name: "PRODU_PRODUCTO" })
  produ_producto: number;

}