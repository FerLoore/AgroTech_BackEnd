import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("AGRO_REPORTES")
export class AgroReporte {
    @PrimaryGeneratedColumn({ name: "REPO_REPORTE" })
    repo_reporte: number;

    @Column({ name: "REPO_FECHA", type: "timestamp", default: () => "SYSTIMESTAMP" })
    repo_fecha: Date;

    @Column({ name: "REPO_TIPO", type: "varchar2", length: 100 })
    repo_tipo: string;

    @Column({ name: "REPO_SECCIONES", type: "varchar2", length: 255 })
    repo_secciones: string;

    @Column({ name: "REPO_PDF_BASE64", type: "clob" })
    repo_pdf_base64: string;

    @Column({ name: "FIN_FINCA", type: "number" })
    fin_finca: number;

    @Column({ name: "USU_USUARIO", type: "number", nullable: true })
    usu_usuario: number;

    @Column({ name: "REPO_USUARIO_NOMBRE", type: "varchar2", length: 150, nullable: true })
    repo_usuario_nombre: string;
}
