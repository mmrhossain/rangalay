import {create} from "zustand";
import {Order, OrderDetails, OrderState} from "@/types/order";
import {getData, postData} from "@/lib/api";
import {ApiResponse} from "@/types/api";


export const useOrderStore = create<OrderState>((set, get) => ({

    loading: false,

    setLoading: (value: boolean) => {
        set({loading: value});
    },

    orders: null,

    createOrder: async (data: Order) => {
        try {

            get().setLoading(true);

            const res = await postData<ApiResponse<void>>(
                "/orders/place",
                {
                    params: {
                        user_id: data.user_id,
                        name: data.name,
                        phone: data.phone,
                        address: data.address,
                        country: data.country,
                        division: data.division,
                        district: data.district,
                        thana: data.thana,
                        postal_code: data.postal_code
                    }
                }
            );

            return res;
        } catch (err) {
            console.error("Order create failed", err);
            throw err;
        } finally {
            get().setLoading(false);
        }
    },


    fetchOrderList: async (id: number) => {
        try {

            get().setLoading(true);
            const res = await getData<ApiResponse<OrderDetails[]>>("/orders", {
                params: {
                    user_id: id
                }
            })

            set({orders: res.data || []});

            return res
        } catch (err) {
            console.error("Order List fetch failed", err);
            throw err
        } finally {
            get().setLoading(false);
        }
    },


}));