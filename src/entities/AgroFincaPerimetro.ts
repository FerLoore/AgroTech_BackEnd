import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("AGRO_FINCA_PERIMETRO")
export class AgroFincaPerimetro {

    // ✅ PrimaryGeneratedColumn — el trigger de Oracle asigna el ID
    @PrimaryGeneratedColumn({ name: "PERIM_PERIMETRO" })
    perim_perimetro: number;

    @Column({ name: "FIN_FINCA", type: "number" })
    fin_finca: number;

    @Column({ name: "PERIM_ORDEN", type: "number" })
    perim_orden: number;

    @Column({ name: "PERIM_LATITUD", type: "number", precision: 10, scale: 7 })
    perim_latitud: number;

    @Column({ name: "PERIM_LONGITUD", type: "number", precision: 10, scale: 7 })
    perim_longitud: number;

    @Column({ name: "SECC_SECCIONES", type: "number", nullable: true })
    secc_seccion: number;
}