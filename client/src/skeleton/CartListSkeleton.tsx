

import Skeleton from "react-loading-skeleton";


const CartListSkeleton = () => {

    return (
        <section className="container py-12 space-y-12 2xl:w-[70%] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-8">
                {/* Cart items */}
                <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <Skeleton width={160} height={24} />
                        <Skeleton width={80} height={24} borderRadius={999} />
                    </div>

                    <div className="space-y-6">
                        {[1, 2, 3].map((_, i) => (
                            <div
                                key={i}
                                className="flex items-start justify-between border-b border-gray-200 py-4"
                            >
                                {/* Left side */}
                                <div className="flex items-start gap-4 w-2/3">
                                    {/* Remove */}
                                    <Skeleton width={24} height={24} />

                                    {/* Image */}
                                    <Skeleton width={128} height={160} />

                                    {/* Info */}
                                    <div className="space-y-2 w-full">
                                        <Skeleton width="70%" height={16} />
                                        <Skeleton width="40%" height={14} />
                                        <Skeleton width="30%" height={14} />

                                        {/* Quantity */}
                                        <div className="mt-3">
                                            <Skeleton width={60} height={14} />
                                            <div className="flex gap-2 mt-2">
                                                <Skeleton width={36} height={36} />
                                                <Skeleton width={40} height={36} />
                                                <Skeleton width={36} height={36} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Price */}
                                <Skeleton width={80} height={16} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subtotal */}
                <div className="border border-gray-200 p-6 h-fit">
                    <Skeleton width={120} height={20} />
                    <Skeleton height={16} />
                    <Skeleton height={16} />
                    <Skeleton height={16} />
                    <Skeleton height={44} />
                </div>
            </div>
        </section>
    );
};

export default CartListSkeleton;
