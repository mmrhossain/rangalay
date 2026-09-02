import AccountDetails from "@/components/customer/account/AccountDetails";
import ProtectedRoute from "@/components/protect/ProtectedRoute";

const Page = () => {



    return (
        <ProtectedRoute>
            <AccountDetails />
        </ProtectedRoute>
    );
};

export default Page;