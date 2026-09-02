import { z } from "zod";

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

export const createFaqCategorySchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: slugSchema,
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const updateFaqCategorySchema = createFaqCategorySchema.partial();

export const createFaqItemSchema = z.object({
  categoryId: z.string().min(1),
  question: z.string().trim().min(1).max(500),
  answer: z.string().trim().min(1),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(false),
});

export const updateFaqItemSchema = createFaqItemSchema.partial();

export const listFaqItemsQuerySchema = z.object({
  categoryId: z.string().min(1).optional(),
});

export type CreateFaqCategoryInput = z.infer<typeof createFaqCategorySchema>;
export type UpdateFaqCategoryInput = z.infer<typeof updateFaqCategorySchema>;
export type CreateFaqItemInput = z.infer<typeof createFaqItemSchema>;
export type UpdateFaqItemInput = z.infer<typeof updateFaqItemSchema>;
