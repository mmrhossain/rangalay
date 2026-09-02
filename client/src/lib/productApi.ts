

import {Product} from "@/types/product";
import {getData} from "@/lib/api";
import {ApiResponse} from "@/types/api";

// Fetch product details
export  async function fetchProduct(id: number): Promise<Product| null> {
    if (!id) return null;

    const result: ApiResponse<Product> = await getData<ApiResponse<Product>>(
        `/products/${id}`,
        { next: { revalidate: 60 } } // optional: cache for 1 min
    );

    return result?.data ?? null;
}


// fetch products by remark
export async function fetchProductsByRemark( remark: string ): Promise<ApiResponse<Product[]> | null> {
    try {
        const res = await getData<ApiResponse<Product[]>>("/products", {
            params: { remarks: remark },

            next: { revalidate : 60}
        });

        return res;
    } catch (err) {
        console.error(err);
        return null;
    }
}

// search product by keyword
export async function searchProduct(keyword: string): Promise<ApiResponse<Product[]> | null> {

    try {
        const res = await getData<ApiResponse<Product[]>>("/products", {
            params: { search: keyword }
        });

        return res;
    } catch (err) {
        console.error(err);
        return null;
    }
}


// fetch all product list
export async function fetchProducts(): Promise<ApiResponse<Product[]> | null> {
    try {
        const res = await getData<ApiResponse<Product[]>>("/products", {
            next: { revalidate : 60}
        });

        return res;
    } catch (err) {
        console.error(err);
        return null;
    }
}