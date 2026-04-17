import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("AGRO_ALERTA_SALUD")
export class AgroAlertaSalud {

  @PrimaryColumn({ name: "ALERTSALU_ALERTA_SALUD", type: "number" })
  alertsalud_id: number;

  @Column({ name: "ALERTSALU_FECHA_DETECCION", type: "date" })
  fecha_deteccion: Date;

  @Column({ name: "ALERTSALU_DESCRIPCION_SINTOMA", type: "varchar", length: 500, nullable: true })
  descripcion_sintoma: string;

  @Column({ name: "ALERTSALU_FOTO", type: "varchar", length: 500, nullable: true })
  foto: string;

  @Column({ name: "ARB_ARBOL", type: "number" })
  arb_arbol: number;

  @Column({ name: "USU_USUARIO", type: "number" })
  usu_usuario: number;

  @Column({ name: "ALERTSALU_ACTIVO", type: "number", default: 1 })
  alertsalud_activo: number;
}