import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("AGRO_FINCA")
export class AgroFinca {

    @PrimaryGeneratedColumn({ name: "FIN_FINCA" })
    fin_finca: number;

    @Column({ name: "FIN_NOMBRE", type: "varchar2", length: 150 })
    fin_nombre: string;

    @Column({ name: "FIN_UBICACION", type: "varchar2", length: 255, nullable: true })
    fin_ubicacion: string;

   @Column({ name: "FIN_HECTAREA", type: "number", precision: 10, scale: 2, nullable: true})
    fin_hectarea: number;
    
    @Column({ name: "FIN_ACTIVO", type: "number", default: 1 })
    fin_activo: number;
}