import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("AGRO_TIPO_ARBOL")
export class AgroTipoArbol {

    @PrimaryGeneratedColumn({ name: "TIPAR_TIPO_ARBOL" })
    tipar_tipo_arbol: number;

    @Column({ name: "TIPAR_NOMBRE_COMUN", type: "varchar2", length: 150 })
    tipar_nombre_comun: string;

    @Column({ name: "TIPAR_NOMBRE_CIENTIFICO", type: "varchar2", length: 150, nullable: true })
    tipar_nombre_cientifico: string;

    @Column({ name: "TIPAR_ANIOS_PRODUCCION", type: "number", default: 8 })
    tipar_anios_produccion: number;

    @Column({ name: "TIPAR_DESCRIPCION", type: "varchar2", length: 300, nullable: true })
    tipar_descripcion: string;
}