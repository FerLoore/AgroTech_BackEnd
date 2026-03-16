import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("AGRO_ANALISIS_LABORATORIO")
export class AgroAnalisisLaboratorio {

  @PrimaryColumn({ name: "ANALAB_ANALISIS_LABORATORIO", type: "number" })
  analab_analisis_laboratorio: number;

  @Column({ name: "ANALAB_LABORATORIO_NOMBRE", type: "varchar", length: 200 })
  analab_laboratorio_nombre: string;

  @Column({ name: "ANALAB_FECHA_ENVIO", type: "date" })
  analab_fecha_envio: Date;

  @Column({ name: "ANALAB_FECHA_RESULTADO", type: "date", nullable: true })
  analab_fecha_resultado: Date;

  @Column({ name: "ANALAB_RESULTADO_TIPO", type: "varchar", length: 100, nullable: true })
  analab_resultado_tipo: string;

  @Column({ name: "ALERT_ALERTA_SALUD", type: "number" })
  alert_alerta_salud: number;

  @Column({ name: "CATPATO_CATALOGO_PATOGENO", type: "number", nullable: true })
  catpato_catalogo_patogeno: number;

  @Column({ name: "USU_USUARIO", type: "number", nullable: true })
  usu_usuario: number;
}