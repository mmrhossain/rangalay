
// get categories
import {ApiResponse} from "@/types/api";
import {Category} from "@/types/category";
import {getData} from "@/lib/api";

export async function getCategories(): Promise<ApiResponse<Category[]> | null> {
    try {
        const result = await getData<ApiResponse<Category[]>>("/categories", {
            next: { revalidate: 60 },
        });

        // if API returns empty data
        if (!result?.data) return null;

        return result;
    } catch (err) {
        console.error(err);
        return null;
    }
}



// Fetch category/subcategory details

export  async function categoryDetails(id: number): Promise<Category | null> {
    if (!id) return null;

    const result: ApiResponse<Category> = await getData<ApiResponse<Category>>(
        `/categories/${id}`,
        {next: { revalidate: 60 }}
    );

    return result?.data ?? null;
}
