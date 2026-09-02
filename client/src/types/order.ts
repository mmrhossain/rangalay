import {ApiResponse} from "@/types/api";
import {CartItem} from "@/types/cart";


export interface Order {
    id?: number,
    user_id?: string | number,
    name: string,
    phone: string,
    address: string,
    country: string,
    postal_code: string,
    division: string,
    district: string,
    thana: string
}

export interface  OrderDetails {
    id: number,
    user_id: string | number,
    order_number: string,
    total_amount: string | number,
    status: string,
    payment_method: null | string,
    payment_status: string,
    created_at: string,
    items: CartItem[],
}


export interface OrderState {

    loading: boolean,
    setLoading: (loading: boolean) => void;

    orders: OrderDetails[] | null;

    createOrder: (data: Order) => Promise<ApiResponse<void | undefined>>;

    fetchOrderList: (id: number) => Promise<ApiResponse<OrderDetails[]>>;

}