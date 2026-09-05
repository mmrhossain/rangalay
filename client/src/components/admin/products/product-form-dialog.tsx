"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createProduct,
  createProductVariant,
  fetchBrands,
  fetchCategories,
  fetchProductBySlug,
  toErrorMessage,
  updateProduct,
  updateProductVariant,
  type ProductListItem,
} from "@/lib/dashboard-api/products";

const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: slugSchema,
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().optional(),
  description: z.string().optional(),
  variantSku: z.string().min(1, "SKU is required"),
  variantPrice: z.number().positive("Price must be positive"),
  variantStock: z.number().int().nonnegative("Stock cannot be negative"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export type ProductFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: ProductListItem;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function defaultValues(
  initialData?: ProductListItem,
  detail?: {
    description?: string | null;
    shortDescription?: string | null;
    variants: Array<{
      sku: string;
      price: number | string;
      availableStock?: number;
    }>;
  }
): ProductFormValues {
  const variant = detail?.variants[0] ?? initialData?.variants[0];
  const description =
    detail?.description ??
    detail?.shortDescription ??
    initialData?.shortDescription ??
    "";
  return {
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    categoryId: initialData?.category?.id ?? "",
    brandId: initialData?.brand?.id ?? "",
    description: description ?? "",
    variantSku:
      variant && "sku" in variant && typeof variant.sku === "string" && variant.sku
        ? variant.sku
        : initialData
          ? `${initialData.slug}-default`
          : "",
    variantPrice: variant ? Number(variant.price) || 0 : 0,
    variantStock:
      variant && "availableStock" in variant
        ? Number(variant.availableStock) || 0
        : 0,
  };
}

export function ProductFormDialog({
  open,
  onOpenChange,
  mode,
  initialData,
}: ProductFormDialogProps) {
  const queryClient = useQueryClient();
  const slugManual = useRef(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues(initialData),
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    enabled: open,
    staleTime: 60_000,
  });

  const brandsQuery = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
    enabled: open,
    staleTime: 60_000,
  });

  const detailQuery = useQuery({
    queryKey: ["product-detail", initialData?.slug],
    queryFn: () => fetchProductBySlug(initialData!.slug),
    enabled: open && mode === "edit" && Boolean(initialData?.slug),
  });

  useEffect(() => {
    if (!open) return;
    slugManual.current = mode === "edit";
    form.reset(defaultValues(initialData, detailQuery.data));
  }, [open, mode, initialData, detailQuery.data, form]);

  const nameValue = form.watch("name");
  useEffect(() => {
    if (!open || slugManual.current) return;
    form.setValue("slug", slugify(nameValue), { shouldValidate: false });
  }, [nameValue, open, form]);

  const mutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const productBody = {
        name: values.name,
        slug: values.slug,
        description: values.description || undefined,
        shortDescription: values.description || undefined,
        categoryId: values.categoryId,
        brandId: values.brandId ? values.brandId : null,
        isPublished: true,
      };
      const variantBody = {
        sku: values.variantSku,
        price: values.variantPrice,
        isDefault: true,
      };

      if (mode === "create") {
        const product = await createProduct(productBody);
        await createProductVariant(product.id, variantBody);
        return;
      }

      if (!initialData?.id) throw new Error("Missing product id");
      await updateProduct(initialData.id, productBody);
      const existingVariantId = initialData.variants[0]?.id;
      if (existingVariantId) {
        await updateProductVariant(existingVariantId, {
          sku: values.variantSku,
          price: values.variantPrice,
        });
      } else {
        await createProductVariant(initialData.id, variantBody);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(
        mode === "create" ? "Product created" : "Product updated"
      );
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(toErrorMessage(err));
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Product" : "Edit Product"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a product with at least one variant."
              : "Update product details and default variant."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="product-slug"
                      {...field}
                      onChange={(e) => {
                        slugManual.current = true;
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(categoriesQuery.data ?? []).map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brandId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select
                    onValueChange={(v) =>
                      field.onChange(v === "__none__" ? "" : v)
                    }
                    value={field.value ? field.value : "__none__"}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__none__">No brand</SelectItem>
                      {(brandsQuery.data ?? []).map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Product description"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="variantSku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="SKU-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="variantPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={Number.isFinite(field.value) ? field.value : ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : e.target.valueAsNumber
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="variantStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                      type="number"
                      min={0}
                      step="1"
                      value={Number.isFinite(field.value) ? field.value : ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : e.target.valueAsNumber
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? "Saving..."
                  : mode === "create"
                    ? "Create product"
                    : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
