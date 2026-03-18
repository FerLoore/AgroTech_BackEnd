import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("AGRO_CLIMA")
export class AgroClima {

    @PrimaryGeneratedColumn({ name: "CLIM_CLIMA" })
    clim_clima: number;

    @Column({ name: "CLIM_FECHA", type: "timestamp", default:() => "SYSTIMESTAMP" })
    clim_fecha: Date;

    @Column({ name: "CLIM_TEMPERATURA", type: "number", precision: 5, scale: 2, nullable: true })
    clim_temperatura: number;

   @Column({ name: "CLIM_HUMEDAD_RELATIVA", type: "number", precision: 5, scale: 2, nullable: true})
    clim_humedad_relativa: number;

    @Column({ name: "CLIM_PRECIPITACION", type: "number", precision: 8, scale: 2, nullable: true})
    clim_precipitacion: number;
    
    @Column({ name: "SECC_SECCION", type: "number",})
    secc_seccion: number;
}