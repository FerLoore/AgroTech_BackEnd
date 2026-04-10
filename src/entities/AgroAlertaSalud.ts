import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("AGRO_ALERTA_SALUD")
export class AgroAlertaSalud {

  @PrimaryGeneratedColumn({ name: "ALERTSALU_ALERTA_SALUD" })
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
}