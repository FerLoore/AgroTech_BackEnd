import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("AGRO_CATALOGO_PATOGENO")
export class AgroCatalogoPatogeno {

    @PrimaryGeneratedColumn({ name: "CATPATO_CATALOGO_PATOGENO" })
    catpato_catalogo_patogeno: number;

    @Column({ name: "CATPATO_NOMBRE_COMUN", type: "varchar2", length: 150 })
    catpato_nombre_comun: string;

    @Column({ name: "CATPATO_NOMBRE_CIENTIFICO", type: "varchar2", length: 150, nullable: true })
    catpato_nombre_cientifico: string;

    @Column({ name: "CATPATO_TIPO", type: "varchar2", length: 50 })
    catpato_tipo: string;

    @Column({ name: "CATPATO_GRAVEDAD", type: "number" })
    catpato_gravedad: number;

    @Column({ name: "CATPATO_ACTIVO", type: "number", default: 1 })
    catpato_activo: number;
}