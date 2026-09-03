import { Router } from "express";
import {
  optionalAuth,
  requireAuth,
  requireRole,
  requireApproval,
} from "../../../../common/middleware/auth.middleware.ts";
import {
  getProducts,
  getProduct,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
  createVariantHandler,
  updateVariantHandler,
  deleteVariantHandler,
} from "../controllers/product.controller.ts";

const router = Router();

// Public catalog
router.get("/products", optionalAuth, getProducts);
router.get("/products/:slug", getProduct);

const adminAndVendor = [
  requireAuth,
  requireRole("ADMIN", "VENDOR"),
  requireApproval,
];

// Admin: products & variants
router.post("/admin/products", ...adminAndVendor, createProductHandler);
router.put("/admin/products/:id", ...adminAndVendor, updateProductHandler);
router.delete("/admin/products/:id", ...adminAndVendor, deleteProductHandler);
router.post(
  "/admin/products/:productId/variants",
  ...adminAndVendor,
  createVariantHandler
);
router.put("/admin/variants/:id", ...adminAndVendor, updateVariantHandler);
router.delete("/admin/variants/:id", ...adminAndVendor, deleteVariantHandler);

export default router;
