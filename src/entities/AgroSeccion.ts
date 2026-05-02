import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { AgroFinca } from "./AgroFinca";


@Entity("AGRO_SECCION")
export class AgroSeccion {

    @PrimaryGeneratedColumn({ name: "SECC_SECCION" })
    secc_seccion: number;

    @Column({ name: "SECC_NOMBRE", type: "varchar2", length: 150 })
    secc_nombre: string;

    @Column({ name: "FIN_FINCA", type: "number", nullable: true })
    fin_finca: number;

    @ManyToOne(() => AgroFinca)
    @JoinColumn({ name: "FIN_FINCA" })
    finca: AgroFinca;


   @Column({ name: "SECC_TIPO_SUELO", type: "varchar2", length: 80})
    secc_tipo_suelo: string;
    
    @Column({ name: "SECC_ACTIVO", type: "number", default: 1 })
    secc_activo: number;
}