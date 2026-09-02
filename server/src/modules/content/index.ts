import { Router } from "express";
import legalRoutes from "./legal/routes/legal.routes.ts";
import faqRoutes from "./faq/routes/faq.routes.ts";

const router = Router();

router.use(legalRoutes);
router.use(faqRoutes);

export default router;
