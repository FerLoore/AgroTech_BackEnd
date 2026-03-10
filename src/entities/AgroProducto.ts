import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("AGRO_PRODUCTO")
export class AgroProducto {

    @PrimaryGeneratedColumn({ name: "PRODU_PRODUCTO" })
    produ_producto: number;

    @Column({ name: "PRODU_NOMBRE", type: "varchar2", length: 150 })
    produ_nombre: string;

    @Column({ name: "PRODU_TIPO", type: "varchar2", length: 100 })
    produ_tipo: string;

    @Column({ name: "PRODU_CONCENTRACION", type: "varchar2", length: 100, nullable: true })
    produ_concentracion: string;

    @Column({ name: "PRODU_UNIDAD", type: "varchar2", length: 50, nullable: true })
    produ_unidad: string;

    @Column({ name: "PRODU_ACTIVO", type: "number", default: 1 })
    produ_activo: number;
}