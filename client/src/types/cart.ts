import {ApiResponse} from "@/types/api";
import {Product} from "@/types/product";


export interface CartItem {
    id?: number;
    user_id?: number;
    product_id: number;
    quantity: string | number;
    price?: string | null | undefined;
    product_stock_id: number;
    product?: Product | null,
    size?: string | null
    color?: string | null;
    from_source?: string | null
}


export interface CartState {

    cart: CartItem[] | null;
    cartCount: number;
    discount: number;
    totalAmount: number | string,
    discountAmount: number | string,
    vatAmount: number | string,
    payableAmount: number | string,

    cartLoading: Record<number, boolean>;
    setCartLoading: (id: number, loading: boolean) => void;

    fetchCart: () => Promise<void>;
    addToCart: (item: CartItem) => Promise<ApiResponse<CartItem>>;
    updateCart: (id: number, data: {quantity: string | number, size: string, color: string}) => Promise<ApiResponse<void>>;
    removeFromCart: (id: number) => Promise<ApiResponse<void>>;
    clearCart: () => void;

}