import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("AGRO_FUMIGACION")
export class AgroFumigacion {
    @PrimaryGeneratedColumn({ name: "FUMI_FUMIGACION" })
    fumi_fumigacion: number;

    @Column({ name: "FUMI_SECCION", type: "number" })
    fumi_seccion: number;

    @Column({ name: "FUMI_PRODUCTO", type: "number" })
    fumi_producto: number;

    @Column({ name: "FUMI_FECHA_PROGRAMADA", type: "date" })
    fumi_fecha_programada: Date;

    @Column({ name: "FUMI_DOSIS", type: "varchar2", length: 100 })
    fumi_dosis: string;

    @Column({ name: "FUMI_ESTADO", type: "varchar2", length: 20, default: 'Pendiente' })
    fumi_estado: string;
}