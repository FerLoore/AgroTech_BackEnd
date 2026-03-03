import { Router } from "express";
import { prueba } from "./handlers";
const router = Router();

router.get('/', prueba);

export default router;