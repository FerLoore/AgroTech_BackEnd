import { AppDataSource } from "./src/config/data-source";
import { AgroTratamientos } from "./src/entities/AgroTratamientos";

async function test() {
  try {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(AgroTratamientos);
    const data = await repo.find();
    console.log("Tratamientos (len):", data.length);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}
test();
