import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { AgroFinca } from "./AgroFinca";

@Entity("AGRO_FINCA_PERIMETRO")
export class AgroFincaPerimetro {
    @PrimaryColumn({ name: "PERIM_PERIMETRO", type: "number" })
    perim_perimetro: number;

    @Column({ name: "FIN_FINCA", type: "number" })
    fin_finca: number;

    @Column({ name: "PERIM_ORDEN", type: "number" })
    perim_orden: number;

    @Column({ name: "PERIM_LATITUD", type: "number", precision: 10, scale: 7 })
    perim_latitud: number;

    @Column({ name: "PERIM_LONGITUD", type: "number", precision: 10, scale: 7 })
    perim_longitud: number;
}