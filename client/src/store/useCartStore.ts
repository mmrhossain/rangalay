import { create } from "zustand";
import { CartItem, CartState } from "@/types/cart";
import { deleteData, getData, postData, putData } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {getUserId, setUserId} from "@/utils";



export const useCartStore = create<CartState>((set, get) => ({

    cart: null,
    totalAmount: 0,
    discount: 0,
    discountAmount: 0,
    vatAmount: 0,
    payableAmount: 0,
    cartCount: 0,


    cartLoading: {},

    setCartLoading: (id: number, value: boolean) =>
        set((state) => ({
            cartLoading: {
                ...state.cartLoading,
                [id]: value,
            },
        })),


    fetchCart: async () => {
        try {
            const userId = getUserId();
            if (!userId) {
                set({ cart: [], cartCount: 0 });
                return;
            }

            const res = await getData<ApiResponse<CartItem[]>>("/cart", {
                params: { user_id: userId },
            });

            const data = res.data || [];
            set({ cart: data, cartCount: data.length });

            let actualSubTotal = 0;
            let discountTotal = 0;

            data.forEach((item: CartItem) => {
                const qty = Number(item.quantity || 0);
                const price = Number(item.product?.price || 0);
                const discount = Number(item.product?.discount || 0);

                const actualItemTotal = price * qty;
                actualSubTotal += actualItemTotal;

                if (discount > 0) {
                    discountTotal += (actualItemTotal * discount) / 100;
                }
            });

            const subTotalAfterDiscount = actualSubTotal - discountTotal;
            const vat = Math.round(subTotalAfterDiscount * 0.05);
            const payable = Math.round(subTotalAfterDiscount + vat);

            set({
                totalAmount: actualSubTotal,      // ৳ 10175
                discountAmount: discountTotal,    // ৳ 672
                vatAmount: vat,                   // ৳ 475
                payableAmount: payable,           // ৳ 9977
            });

        } catch (err) {
            console.error("Fetch cart error", err);
        }
    },




    addToCart: async (item: CartItem): Promise<ApiResponse<CartItem>> => {
        try {
            let  userId = getUserId();
            if(!userId){
                userId = setUserId(2)
            }
            console.log("Adding to cart for user ID:", userId);
            const res = await postData<ApiResponse<CartItem>>("/cart/add", {
                params: {
                    user_id: userId,
                    product_id: item.product_id,
                    product_stock_id: item.product_stock_id,
                    quantity: item.quantity,
                    color: item.color,
                    size: item.size,
                    from_source: item.from_source,
                }
            });

            await get().fetchCart();

            return res;
        }catch (err) {
            console.error("Add to cart error", err);
            throw err
        }
    },

    updateCart: async (id: number, data): Promise<ApiResponse<void>> => {
        try {
            const res = await putData<ApiResponse<void>>(`/cart/update/${id}`, {
                params: {
                    quantity: data.quantity,
                    size: data.size ? data.size : null,
                    color: data.color ? data.color : null,
                }
            });

            return res
        }catch (err) {
            console.error("Update cart error", err);
            throw err
        }
    },


    removeFromCart: async (id: number) => {
        try{
            const res= await deleteData<ApiResponse<void>>(`/cart/remove/${id}`);

            return res
        }catch (err) {
            console.error("Remove cart error", err);
            throw err
        }
    },

    clearCart: () => {
        set({ cart: [], cartCount: 0, totalAmount: 0, discountAmount: 0, vatAmount: 0, payableAmount: 0 });
    }

}));
