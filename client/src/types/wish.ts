import {ApiResponse} from "@/types/api";
import {Product} from "@/types/product";


export interface WishItem {
    id?: number;
    user_id?: number;
    product_id: number;
    quantity: number;
    price?: number;
    product_stock_id?: number;
    product?: Product;
}


export interface WishState {

    wishLoading: Record<number, boolean>;
    setWishLoading: (id: number, loading: boolean) => void;

    wishListLoading: boolean;
    setWishListLoading: (value: boolean) => void;

    wishes: WishItem[] | null;
    wishCount: number;


    fetchWishList: () => Promise<void>;
    addToWish: (item: WishItem) => Promise<ApiResponse<WishItem>>;
    removeFromWishList: (id: number) =>  Promise<ApiResponse<void>>;
    clearWish: () => void;
}