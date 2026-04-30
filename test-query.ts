import { AppDataSource } from "./src/config/data-source";

async function createTable() {
  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await AppDataSource.initialize();
    console.log("Conectado a la base de datos.");
    
    console.log("Creando tabla AGRO_MANTENIMIENTO_SECC y secuencia...");
    // Sequence
    try {
      await queryRunner.query(`CREATE SEQUENCE SEQ_MANTENIMIENTO_SECC START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE`);
    } catch (e: any) {
      if (!e.message.includes("ORA-00955")) console.error("Error seq:", e.message); // ORA-00955: name is already used
    }

    // Table
    try {
      await queryRunner.query(`
        CREATE TABLE AGRO_MANTENIMIENTO_SECC (
          MAN_ID NUMBER PRIMARY KEY,
          SECC_SECCION NUMBER NOT NULL,
          MAN_TIPO VARCHAR2(100) NOT NULL,
          MAN_FRECUENCIA_DIAS NUMBER NOT NULL,
          MAN_ULTIMA_FECHA DATE,
          MAN_PROXIMA_FECHA DATE,
          CONSTRAINT FK_MAN_SECC FOREIGN KEY (SECC_SECCION) REFERENCES AGRO_SECCION(SECC_SECCION) ON DELETE CASCADE
        )
      `);
      console.log("Tabla creada exitosamente.");
    } catch (e: any) {
      if (e.message.includes("ORA-00955")) {
        console.log("La tabla ya existe.");
      } else {
        throw e;
      }
    }

  } catch (error) {
    console.error("Error al crear la tabla:", error);
  } finally {
    await queryRunner.release();
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

createTable();
