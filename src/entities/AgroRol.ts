import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("AGRO_ROL")
export class AgroRol {

    @PrimaryColumn({ name: "ROL_ROL" })
    rol_rol: number;

    @Column({ name: "ROL_NOMBRE", type: "varchar2", length: 100 })
    rol_nombre: string;

    @Column({ name: "ROL_DESCRIPCION", type: "varchar2", length: 300, nullable: true })
    rol_descripcion: string;

    @Column({ name: "ROL_PERMISO", type: "number" })
    rol_permiso: number;

    @Column({ name: "ROL_ACTIVO", type: "number", default: 1 })
    rol_activo: number;
}