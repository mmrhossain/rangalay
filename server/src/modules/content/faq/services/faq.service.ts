import { prisma } from "../../../../lib/prisma.ts";
import { AppError } from "../../../../common/errors/AppError.ts";
import type {
  CreateFaqCategoryInput,
  CreateFaqItemInput,
  UpdateFaqCategoryInput,
  UpdateFaqItemInput,
} from "../validators/faq.validators.ts";

const isPrismaCode = (err: unknown, code: string): boolean =>
  typeof err === "object" &&
  err !== null &&
  "code" in err &&
  (err as { code: unknown }).code === code;

export const getPublicFaqs = async () => {
  return prisma.faqCategory.findMany({
    where: {
      isActive: true,
      items: { some: { isPublished: true } },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      sortOrder: true,
      items: {
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          question: true,
          answer: true,
          sortOrder: true,
        },
      },
    },
  });
};

export const listFaqCategories = async () => {
  const categories = await prisma.faqCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { items: true } } },
  });

  return categories.map(({ _count, ...category }) => ({
    ...category,
    itemCount: _count.items,
  }));
};

export const createFaqCategory = async (input: CreateFaqCategoryInput) => {
  try {
    return await prisma.faqCategory.create({
      data: {
        name: input.name,
        slug: input.slug,
        sortOrder: input.sortOrder,
        isActive: input.isActive,
      },
    });
  } catch (err) {
    if (isPrismaCode(err, "P2002")) {
      throw new AppError("FAQ category slug already exists", 409);
    }
    throw err;
  }
};

export const updateFaqCategory = async (
  id: string,
  input: UpdateFaqCategoryInput
) => {
  const existing = await prisma.faqCategory.findUnique({ where: { id } });
  if (!existing) throw new AppError("FAQ category not found", 404);

  try {
    return await prisma.faqCategory.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.slug !== undefined && { slug: input.slug }),
        ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });
  } catch (err) {
    if (isPrismaCode(err, "P2002")) {
      throw new AppError("FAQ category slug already exists", 409);
    }
    throw err;
  }
};

export const deleteFaqCategory = async (id: string) => {
  const existing = await prisma.faqCategory.findUnique({ where: { id } });
  if (!existing) throw new AppError("FAQ category not found", 404);

  const itemCount = await prisma.faqItem.count({ where: { categoryId: id } });
  if (itemCount > 0) {
    throw new AppError("Cannot delete FAQ category that still has items", 409);
  }

  try {
    return await prisma.faqCategory.delete({ where: { id } });
  } catch (err) {
    if (isPrismaCode(err, "P2003")) {
      throw new AppError("Cannot delete FAQ category that still has items", 409);
    }
    throw err;
  }
};

export const listFaqItems = async (categoryId?: string) => {
  if (categoryId) {
    const category = await prisma.faqCategory.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });
    if (!category) throw new AppError("FAQ category not found", 404);
  }

  return prisma.faqItem.findMany({
    where: categoryId ? { categoryId } : {},
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
};

export const createFaqItem = async (input: CreateFaqItemInput) => {
  const category = await prisma.faqCategory.findUnique({
    where: { id: input.categoryId },
  });
  if (!category) throw new AppError("FAQ category not found", 404);

  return prisma.faqItem.create({
    data: {
      categoryId: input.categoryId,
      question: input.question,
      answer: input.answer,
      sortOrder: input.sortOrder,
      isPublished: input.isPublished,
    },
  });
};

export const updateFaqItem = async (id: string, input: UpdateFaqItemInput) => {
  const existing = await prisma.faqItem.findUnique({ where: { id } });
  if (!existing) throw new AppError("FAQ item not found", 404);

  if (input.categoryId && input.categoryId !== existing.categoryId) {
    const category = await prisma.faqCategory.findUnique({
      where: { id: input.categoryId },
    });
    if (!category) throw new AppError("FAQ category not found", 404);
  }

  return prisma.faqItem.update({
    where: { id },
    data: {
      ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
      ...(input.question !== undefined && { question: input.question }),
      ...(input.answer !== undefined && { answer: input.answer }),
      ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
      ...(input.isPublished !== undefined && { isPublished: input.isPublished }),
    },
  });
};

export const deleteFaqItem = async (id: string) => {
  const existing = await prisma.faqItem.findUnique({ where: { id } });
  if (!existing) throw new AppError("FAQ item not found", 404);

  return prisma.faqItem.delete({ where: { id } });
};
