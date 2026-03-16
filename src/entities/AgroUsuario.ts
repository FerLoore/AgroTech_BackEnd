import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("AGRO_USUARIO")
export class AgroUsuario {

    @PrimaryGeneratedColumn({ name: "USU_USUARIO" })
    usu_usuario: number;

    @Column({ name: "USU_NOMBRE", type: "varchar2", length: 150 })
    usu_nombre: string;

    @Column({ name: "ROL_ROL", type: "number"  })
    rol_rol: number;

    @Column({ name: "USU_ESPECIALIDAD", type: "varchar2", length: 150 })
    usu_especialidad: string;

    @Column({ name: "USU_ACTIVO", type: "number", default: 1 })
    usu_activo: number;
} 