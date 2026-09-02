// import {ApiResponse} from "@/types/api";
// import {getData} from "@/lib/api";
// import {Order} from "@/types/order";
// import {getUser} from "@/utils";


// export async function fetchOrderList(): Promise<ApiResponse<Order[]> | null> {
//
//     const user = getUser();
//     const user_id = user.id;
//     if(!user || !user_id) return null;
//
//     try {
//
//         const result = await getData<ApiResponse<Order[]>>("/orders", {
//             params: {
//                 user_id
//             }
//         });
//
//         // if API returns empty data
//         if (!result?.data) return null;
//
//         return result;
//     } catch (err) {
//         console.error(err);
//         return null;
//     }
// }

