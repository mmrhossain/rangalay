import { create } from "zustand";
import {Category, CategoryState} from "@/types/category";
import {getData} from "@/lib/api";
import {ApiResponse} from "@/types/api";
import {baseURL} from "@/utils";


export const useCategoryStore = create<CategoryState>((set) => ({

    categories: null,

    getCategories: async () => {
        try {
            const res = await getData<ApiResponse<Category[]>>(`${baseURL}/categories`);
            const data = res?.data;
            set({categories: data})
        } catch (error: unknown) {
            console.warn("Failed to load categories. Falling back to coming-soon placeholder.", error);
            // set({categories: fallbackCategories});
        }
    }

}));
