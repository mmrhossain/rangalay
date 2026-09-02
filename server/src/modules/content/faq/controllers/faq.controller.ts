import type { Request, Response } from "express";
import { asyncHandler } from "../../../../common/utils/asyncHandler.ts";
import { requireParam } from "../../../../common/utils/requireParam.ts";
import { successResponse } from "../../../../common/utils/response.ts";
import {
  createFaqCategorySchema,
  createFaqItemSchema,
  listFaqItemsQuerySchema,
  updateFaqCategorySchema,
  updateFaqItemSchema,
} from "../validators/faq.validators.ts";
import {
  createFaqCategory,
  createFaqItem,
  deleteFaqCategory,
  deleteFaqItem,
  getPublicFaqs,
  listFaqCategories,
  listFaqItems,
  updateFaqCategory,
  updateFaqItem,
} from "../services/faq.service.ts";

export const getFaqsHandler = asyncHandler(async (_req: Request, res: Response) => {
  successResponse(res, await getPublicFaqs(), "FAQs fetched");
});

export const adminListFaqCategoriesHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    successResponse(res, await listFaqCategories(), "FAQ categories fetched");
  }
);

export const adminCreateFaqCategoryHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const input = createFaqCategorySchema.parse(req.body);
    successResponse(res, await createFaqCategory(input), "FAQ category created", 201);
  }
);

export const adminUpdateFaqCategoryHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const input = updateFaqCategorySchema.parse(req.body);
    successResponse(
      res,
      await updateFaqCategory(requireParam(req.params.id, "id"), input),
      "FAQ category updated"
    );
  }
);

export const adminDeleteFaqCategoryHandler = asyncHandler(
  async (req: Request, res: Response) => {
    successResponse(
      res,
      await deleteFaqCategory(requireParam(req.params.id, "id")),
      "FAQ category deleted"
    );
  }
);

export const adminListFaqItemsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const query = listFaqItemsQuerySchema.parse(req.query);
    successResponse(res, await listFaqItems(query.categoryId), "FAQ items fetched");
  }
);

export const adminCreateFaqItemHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const input = createFaqItemSchema.parse(req.body);
    successResponse(res, await createFaqItem(input), "FAQ item created", 201);
  }
);

export const adminUpdateFaqItemHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const input = updateFaqItemSchema.parse(req.body);
    successResponse(
      res,
      await updateFaqItem(requireParam(req.params.id, "id"), input),
      "FAQ item updated"
    );
  }
);

export const adminDeleteFaqItemHandler = asyncHandler(
  async (req: Request, res: Response) => {
    successResponse(
      res,
      await deleteFaqItem(requireParam(req.params.id, "id")),
      "FAQ item deleted"
    );
  }
);
