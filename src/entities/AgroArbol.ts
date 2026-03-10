import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("AGRO_ARBOL")
export class AgroArbol {

    @PrimaryColumn({ name: "ARB_ARBOL", type: "number" })
    arb_arbol: number;

    @Column({ name: "ARB_POSICION_SURCO", type: "number" })
    arb_posicion_surco: number;

    @Column({ name: "ARB_FECHA_SIEMBRA", type: "date" })
    arb_fecha_siembra: Date;

    @Column({ name: "TIPAR_TIPO_ARBOL", type: "number" })
    tipar_tipo_arbol: number;

    @Column({ name: "ARB_ESTADO", type: "varchar2", length: 20 })
    arb_estado: string;

    @Column({ name: "SUR_SURCOS", type: "number" })
    sur_surcos: number;

    @Column({ name: "ARB_ACTIVO", type: "number", default: 1 })
    arb_activo: number;
}