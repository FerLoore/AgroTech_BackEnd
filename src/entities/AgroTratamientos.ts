import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "AGRO_TRATAMIENTOS" })
export class AgroTratamientos {

  @PrimaryColumn({ name: "TRATA_TRATAMIENTOS" })
  trata_tratamientos: number;

  @Column({ name: "TRATA_FECHA_INICIO", type: "date" })
  trata_fecha_inicio: Date;

  @Column({ name: "TRATA_TIPO", nullable: true })
  trata_tipo: string;

  @Column({ name: "TRATA_DOSIS", nullable: true })
  trata_dosis: string;

  @Column({ name: "TRATA_OBSERVACIONES", nullable: true })
  trata_observaciones: string;

<<<<<<< Updated upstream
  @Column({ name: "TRATA_TIPO", type: "varchar2", length: 20, default: "Curativo" })
  trata_tipo: string;

=======
>>>>>>> Stashed changes
  @Column({ name: "ALERTSALU_ALERTA_SALUD", nullable: true })
  alertsalu_alerta_salud: number;

  @Column({ name: "SECC_SECCION", nullable: true })
  secc_seccion: number;

  @Column({ name: "PRODU_PRODUCTO" })
  produ_producto: number;

<<<<<<< Updated upstream
  @Column({ name: "USU_USUARIO", type: "number", nullable: true })
=======
  @Column({ name: "SECC_SECCION", nullable: true })
  secc_seccion: number;

  @Column({ name: "USU_USUARIO", nullable: true })
>>>>>>> Stashed changes
  usu_usuario: number;

}