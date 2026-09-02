


import { create } from "zustand";
import {deleteData, getData, postData} from "@/lib/api";
import {ApiResponse} from "@/types/api";
import {WishItem, WishState} from "@/types/wish";
import {getUserId,  setUserId} from "@/utils";



export const useWishStore = create<WishState>((set, get) => ({

    wishListLoading: false,
    setWishListLoading: (value: boolean) => {
        set({wishListLoading: value});
    },

    wishLoading: {},

    setWishLoading: (id: number, value: boolean) =>
        set((state) => ({
            wishLoading: {
                ...state.wishLoading,
                [id]: value,
            },
        })),


    wishes: null,
    wishCount: 0,


    fetchWishList: async () => {
        try {
            const userId = getUserId();
            if(!userId) {
                set({ wishes: [], wishCount: 0});
                return;
            }
            // get().setWishListLoading(true);
            const res: ApiResponse<WishItem[]> = await getData<ApiResponse<WishItem[]>>("/wishlist", {
                params: {user_id: userId}
            });

            const data = res.data || [];

            set({ wishes: data, wishCount: data.length });

        } catch (err) {
            console.error("Fetch wishList error", err);
            throw err
        }finally {
            // get().setWishListLoading(false);
        }
    },

    addToWish: async (item: WishItem): Promise<ApiResponse<WishItem>> => {
        try {
            let  userId = getUserId();
            if(!userId){
                userId = setUserId(2)
            }
            console.log('Adding to wish for user id:', userId);
            const res = await postData<ApiResponse<WishItem>>("/wishlist/add", {
                params: {
                    user_id: userId,
                    product_id: item.product_id,
                    product_stock_id: item.product_stock_id,
                    quantity: item.quantity
                }
            });
            await get().fetchWishList();
            return res;
        }catch (err) {
            console.error("Add to wish error", err);
            throw err
        }
    },


    removeFromWishList: async (id: number) => {
        try {
            const userId = getUserId();
            const res= await deleteData<ApiResponse<void>>(`wishlist/remove/${id}`,{
                params: {user_id : userId}
            });
            await get().fetchWishList();
            return res
        }catch (err) {
            console.error("Remove wish error", err);
            throw err
        }
    },

    clearWish: () => {
        set({ wishes: [], wishCount: 0 });
    }

}));
