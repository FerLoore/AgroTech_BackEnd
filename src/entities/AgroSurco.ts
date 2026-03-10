import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("AGRO_SURCO")
export class AgroSurco {

    @PrimaryColumn({ name: "SUR_SURCO" })
    sur_surco: number;

    @Column({ name: "SUR_NUMERO_SURCO", type: "number" })
    sur_numero_surco: number;

    @Column({ name: "SUR_ORIENTACION", type: "varchar2", length: 50, nullable: true })
    sur_orientacion: string;

    @Column({ name: "SUR_ESPACIAMIENTO", type: "number", precision: 5, scale: 2 })
    sur_espaciamiento: number;

    @Column({ name: "SECC_SECCIONES", type: "number" })
    secc_secciones: number;

    @Column({ name: "SUR_ACTIVO", type: "number", default: 1 })
    sur_activo: number;
}