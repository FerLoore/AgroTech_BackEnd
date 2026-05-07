import { AppDataSource } from "../config/data-source";

const alterTable = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");

        // Verificar si la columna existe antes de intentar añadirla
        const cols = await AppDataSource.query(`
            SELECT column_name FROM user_tab_cols WHERE table_name = 'AGRO_REPORTES'
        `);
        const colNames = cols.map((c: any) => c.COLUMN_NAME);

        if (!colNames.includes('REPO_PDF_BASE64')) {
            console.log("Añadiendo REPO_PDF_BASE64...");
            await AppDataSource.query(`ALTER TABLE AGRO_REPORTES ADD REPO_PDF_BASE64 CLOB`);
        }

        if (colNames.includes('REPO_PDF_PATH')) {
            console.log("Eliminando REPO_PDF_PATH...");
            await AppDataSource.query(`ALTER TABLE AGRO_REPORTES DROP COLUMN REPO_PDF_PATH`);
        }

        console.log("Tabla AGRO_REPORTES modificada correctamente.");
        process.exit(0);
    } catch (error) {
        console.error("Error during Data Source initialization", error);
        process.exit(1);
    }
};

alterTable();
