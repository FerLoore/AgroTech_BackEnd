import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("AGRO_AUDITORIA")
export class AgroAuditoria {

    @PrimaryGeneratedColumn({ name: "AUDI_AUDITORIA" })
    audi_auditoria: number;

    @Column({ name: "AUDI_TABLA", type: "varchar2", length: 50 })
    audi_tabla: string;

    @Column({ name: "AUDI_ACCION", type: "varchar2", length: 10 })
    audi_accion: string; 

    @Column({ name: "AUDI_CAMPO", type: "varchar2", length: 80, nullable: true })
    audi_campo: string;

    @Column({ name: "AUDI_VALOR_ANTES", type: "varchar2", length: 500, nullable: true })
    audi_valor_antes: string;

    @Column({ name: "AUDI_VALOR_DESPUES", type: "varchar2", length: 500, nullable: true })
    audi_valor_despues: string;

    @Column({ name: "AUDI_FECHA", type: "timestamp", default: () => "SYSTIMESTAMP" })
    audi_fecha: Date;

    @Column({ name: "USU_USUARIO", type: "number", nullable: true })
    usu_usuario: number;

    @Column({ name: "AUDI_USUARIO_NOMBRE", type: "varchar2", length: 150, nullable: true })
    audi_usuario_nombre: string;
}