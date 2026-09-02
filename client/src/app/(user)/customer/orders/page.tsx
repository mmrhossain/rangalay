import Orders from "@/components/customer/orders/Orders";

const Page = async () => {
    // const result = await fetchOrderList();
    //
    // const orders = result?.data ?? [];
    //
    // if (orders.length === 0) {
    //     return (
    //         <div className="flex items-center justify-center py-20 text-gray-500">
    //             No orders found
    //         </div>
    //     );
    // }

    return (
        <div>
            <Orders />
        </div>
    );
};

export default Page;
