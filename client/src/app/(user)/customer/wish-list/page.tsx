import WishList from "@/components/wish/wishList";
import ProtectedRoute from "@/components/protect/ProtectedRoute";

const Page = () => {
    return (
        <ProtectedRoute>
            <WishList />
        </ProtectedRoute>
    );
};

export default Page;