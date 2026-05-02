import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { AgroSeccion } from "./AgroSeccion";
import { AgroAlertaSalud } from "./AgroAlertaSalud";



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

  @Column({ name: "TRATA_TIPO", type: "varchar2", length: 20, default: "Curativo" })
  trata_tipo: string;

  @Column({ name: "ALERTSALU_ALERTA_SALUD", nullable: true })
  alertsalu_alerta_salud: number;

  @ManyToOne(() => AgroAlertaSalud)
  @JoinColumn({ name: "ALERTSALU_ALERTA_SALUD" })
  alerta: AgroAlertaSalud;


  @Column({ name: "SECC_SECCION", nullable: true })
  secc_seccion: number;

  @ManyToOne(() => AgroSeccion)
  @JoinColumn({ name: "SECC_SECCION" })
  seccion: AgroSeccion;


  @Column({ name: "PRODU_PRODUCTO" })
  produ_producto: number;

  @Column({ name: "USU_USUARIO", type: "number", nullable: true })
  usu_usuario: number;

}