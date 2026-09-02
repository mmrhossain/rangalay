import { Router } from "express";
import legalRoutes from "./legal/routes/legal.routes.ts";

const router = Router();

router.use(legalRoutes);

export default router;
