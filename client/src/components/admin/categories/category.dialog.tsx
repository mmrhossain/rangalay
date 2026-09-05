"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  createCategory,
  toCategoryErrorMessage,
  updateCategory,
  type CategoryListItem,
} from "@/lib/dashboard-api/categories";

const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: slugSchema,
  parentId: z.string().optional(),
  isActive: z.boolean(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: CategoryListItem;
  categories: CategoryListItem[];
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

function defaultValues(initialData?: CategoryListItem): CategoryFormValues {
  return {
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    parentId: initialData?.parentId ?? "",
    isActive: initialData?.isActive ?? true,
  };
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  mode,
  initialData,
  categories,
}: CategoryFormDialogProps) {
  const queryClient = useQueryClient();
  const slugManual = useRef(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: defaultValues(initialData),
  });

  useEffect(() => {
    if (!open) return;
    slugManual.current = mode === "edit";
    form.reset(defaultValues(initialData));
  }, [open, mode, initialData, form]);

  const nameValue = form.watch("name");
  useEffect(() => {
    if (!open || slugManual.current) return;
    form.setValue("slug", slugify(nameValue), { shouldValidate: false });
  }, [nameValue, open, form]);

  const parentOptions = categories.filter((c) => c.id !== initialData?.id);

  const mutation = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      const body = {
        name: values.name,
        slug: values.slug,
        isActive: values.isActive,
        parentId: values.parentId ? values.parentId : null,
      };
      if (mode === "create") {
        await createCategory(body);
        return;
      }
      if (!initialData?.id) throw new Error("Missing category id");
      await updateCategory(initialData.id, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(
        mode === "create" ? "Category created" : "Category updated"
      );
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(toCategoryErrorMessage(err));
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Category" : "Edit Category"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a category. Leave parent empty for a root category."
              : "Update category details."}
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
                    <Input placeholder="Category name" {...field} />
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
                      placeholder="category-slug"
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
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent category</FormLabel>
                  <Select
                    onValueChange={(v) =>
                      field.onChange(v === "__none__" ? "" : v)
                    }
                    value={field.value ? field.value : "__none__"}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__none__">None</SelectItem>
                      {parentOptions.map((cat) => (
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
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Active</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    ? "Create category"
                    : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
